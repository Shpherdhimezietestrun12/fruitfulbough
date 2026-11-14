"""
Fruitful Bough - sign-up / login server (Flask + MongoDB Atlas, runs on Vercel).

Local run:  set MONGODB_URI in your terminal first, then
            python app.py              (start the server)
            python app.py check        (test an email + password against the database)
"""
import os
import re
import secrets
import smtplib
import sys
from datetime import datetime, timezone
from email.message import EmailMessage
from getpass import getpass

from flask import Flask, jsonify, request
from pymongo import ASCENDING, MongoClient
from pymongo.errors import DuplicateKeyError
from werkzeug.security import check_password_hash, generate_password_hash

SITE_URL = os.environ.get("SITE_URL", "https://fruitfulbough.xyz")
ALLOWED_ORIGIN = os.environ.get("ALLOWED_ORIGIN", "*")  # set to https://fruitfulbough.xyz when live
MAIL_FROM = os.environ.get("MAIL_FROM", "no-reply@fruitfulbough.xyz")

NAME_RE = re.compile(r"^[A-Za-z]{2,}[0-9]+[^A-Za-z0-9\s]+$")
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

app = Flask(__name__)

_DUMMY_HASH = generate_password_hash("not-a-real-password")

# ---- MongoDB -----------------------------------------------------------------
_CI = {"locale": "en", "strength": 2}  # case-insensitive matching
_client = None
_users = None


def users_col():
    """Connect once per warm instance and make sure the unique indexes exist."""
    global _client, _users
    if _users is None:
        _client = MongoClient(os.environ["MONGODB_URI"], serverSelectionTimeoutMS=5000)
        col = _client["fruitfulbough"]["users"]
        col.create_index([("email", ASCENDING)], unique=True, collation=_CI)
        col.create_index([("displayName", ASCENDING)], unique=True, collation=_CI)
        _users = col
    return _users


@app.after_request
def add_cors(resp):
    resp.headers["Access-Control-Allow-Origin"] = ALLOWED_ORIGIN
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    resp.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    return resp


def new_user_id():
    """FB- followed by 9 random digits, e.g. FB-482910377."""
    return "FB-" + "".join(str(secrets.randbelow(10)) for _ in range(9))


def password_problem(pw):
    if len(pw) < 8 or re.search(r"\s", pw):
        return True
    return not (re.search(r"[A-Za-z]", pw) and re.search(r"[0-9]", pw) and re.search(r"[^A-Za-z0-9\s]", pw))


def send_mock_email(to_addr, display_name):
    msg = EmailMessage()
    msg["From"] = MAIL_FROM
    msg["To"] = to_addr
    msg["Subject"] = "Welcome to Fruitful Bough"
    msg.set_content(
        f"Hi {display_name},\n\n"
        f"Thanks for signing up to Fruitful Bough.\n"
        f"Visit us here: {SITE_URL}\n\n"
        f"Every story bears fruit.\n"
    )

    host = os.environ.get("SMTP_HOST")
    if host:
        port = int(os.environ.get("SMTP_PORT", "587"))
        server = smtplib.SMTP_SSL(host, port, timeout=15) if port == 465 else smtplib.SMTP(host, port, timeout=15)
        with server as s:
            if port != 465:
                s.starttls()
            if os.environ.get("SMTP_USER"):
                s.login(os.environ["SMTP_USER"], os.environ.get("SMTP_PASS", ""))
            s.send_message(msg)
        print(f"Email sent to {to_addr} via {host}:{port}")
    else:
        # Vercel's disk is read-only, so mock mode just prints to the logs
        print(f"--- MOCK EMAIL {datetime.now(timezone.utc).isoformat()} ---\n{msg}\n")


@app.route("/api/signup", methods=["POST", "OPTIONS"])
def signup():
    if request.method == "OPTIONS":
        return ("", 204)

    body = request.get_json(silent=True) or {}
    name = str(body.get("displayName", "")).strip()
    email = str(body.get("email", "")).strip()
    password = str(body.get("password", ""))

    if not NAME_RE.match(name) or len(name) > 80:
        return jsonify(error="Display name must be letters, then numbers, then a special character."), 400
    if not EMAIL_RE.match(email):
        return jsonify(error="Enter a valid email address."), 400
    if password_problem(password):
        return jsonify(error="Password must be 8+ characters with letters, numbers and a special character."), 400

    password_hash = generate_password_hash(password)  # never store the plain password

    for _ in range(5):  # retry only if the random ID happens to collide
        user = {
            "_id": new_user_id(),
            "displayName": name,
            "email": email,
            "passwordHash": password_hash,
            "verified": False,
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "status": "visitor",
            "account": "Basic",
            "BooksRead": "0",
            "BooksBought": "0",
            "BooksUploaded": "0",
            "TotalReviews": "0",
        }
        try:
            users_col().insert_one(user)
            break
        except DuplicateKeyError as exc:
            key = (exc.details or {}).get("keyPattern", {})
            if "_id" in key:
                continue  # ID collision, try a new one
            return jsonify(error="An account with this display name or email already exists.",
                           code="account_exists"), 409
    else:
        return jsonify(error="Could not create account, please try again."), 500

    try:
        send_mock_email(email, name)
    except Exception as exc:  # email trouble should not undo a saved account
        print("EMAIL FAILED:", repr(exc))

    return jsonify(ok=True), 201


@app.route("/api/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return ("", 204)

    body = request.get_json(silent=True) or {}
    email = str(body.get("email", "")).strip()
    password = str(body.get("password", ""))

    if not EMAIL_RE.match(email) or not password:
        return jsonify(error="Enter your email and password."), 400

    user = users_col().find_one({"email": email}, collation=_CI)
    stored_hash = user.get("passwordHash", "") if user else _DUMMY_HASH
    password_ok = check_password_hash(stored_hash, password)

    # Same answer whether the email or the password was wrong
    if not user or not password_ok:
        return jsonify(error="Wrong email or password.", code="invalid_credentials"), 401

    return jsonify(ok=True, id=user["_id"], displayName=user.get("displayName")), 200


def check_hash_cli():
    """python app.py check - says whether an email + password match the database."""
    email = input("Email: ").strip()
    user = users_col().find_one({"email": email}, collation=_CI)
    if not user:
        print("NO ACCOUNT with that email")
        return
    ok = check_password_hash(user.get("passwordHash", ""), getpass("Password (hidden): "))
    print("MATCH - login would succeed" if ok else "NO MATCH - login would be refused")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "check":
        check_hash_cli()
        sys.exit(0)
    app.run(host="127.0.0.1", port=5000, debug=True)
