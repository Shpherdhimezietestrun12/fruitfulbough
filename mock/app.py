"""
Fruitful Bough - mock sign-up / login server.

Run:   pip install flask
       python app.py              (start the server)
       python app.py check        (test an email + password against data.json, no server needed)
Listens on http://127.0.0.1:5000  (the front end posts to /api/signup and /api/login)
"""
import json
import os
import re
import secrets
import smtplib
import sys
import tempfile
import threading
import uuid
from datetime import datetime, timezone
from getpass import getpass
from email.message import EmailMessage

from flask import Flask, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

# ---- Change these later ------------------------------------------------------
SITE_URL = os.environ.get("SITE_URL", "https://fruitfulbough.xyz")   # link placed in the email
ALLOWED_ORIGIN = os.environ.get("ALLOWED_ORIGIN", "*")               # tighten when you go live
MAIL_FROM = os.environ.get("MAIL_FROM", "no-reply@fruitfulbough.xyz")
# Real sending only happens if SMTP_HOST is set (SMTP_PORT, SMTP_USER, SMTP_PASS optional).
# Otherwise the email is only written to mock_emails.log and printed (mock mode).
# ------------------------------------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "data.json")
EMAIL_LOG = os.path.join(BASE_DIR, "mock_emails.log")

NAME_RE = re.compile(r"^[A-Za-z]{2,}[0-9]+[^A-Za-z0-9\s]+$")
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

app = Flask(__name__)
_lock = threading.Lock()

# Used so a login for an unknown email takes as long as one for a known email
_DUMMY_HASH = generate_password_hash("not-a-real-password")


@app.after_request
def add_cors(resp):
    resp.headers["Access-Control-Allow-Origin"] = ALLOWED_ORIGIN
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    resp.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    return resp


def load_users():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            return []
    return data if isinstance(data, list) else []


def save_users(users):
    fd, tmp = tempfile.mkstemp(dir=BASE_DIR, suffix=".tmp")
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2, ensure_ascii=False)
    os.replace(tmp, DATA_FILE)  # atomic, avoids half-written files


def new_user_id(users):
    """FB- followed by 9 random digits, e.g. FB-482910377 (never reused)."""
    used = {u.get("id") for u in users}
    while True:
        candidate = "FB-" + "".join(str(secrets.randbelow(10)) for _ in range(9))
        if candidate not in used:
            return candidate


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
        if port == 465:
            server = smtplib.SMTP_SSL(host, port, timeout=15)
        else:
            server = smtplib.SMTP(host, port, timeout=15)
        with server as s:
            if port != 465:
                s.starttls()
            if os.environ.get("SMTP_USER"):
                s.login(os.environ["SMTP_USER"], os.environ.get("SMTP_PASS", ""))
            s.send_message(msg)
        print(f"Email sent to {to_addr} via {host}:{port}")
    else:
        stamp = datetime.now(timezone.utc).isoformat()
        entry = f"--- MOCK EMAIL {stamp} ---\n{msg}\n\n"
        with open(EMAIL_LOG, "a", encoding="utf-8") as f:
            f.write(entry)
        print(entry)


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

    with _lock:
        users = load_users()
        for u in users:
            same_email = u.get("email", "").lower() == email.lower()
            same_name = u.get("displayName", "").lower() == name.lower()
            if same_email or same_name:
                return jsonify(error="An account with this display name or email already exists.",
                               code="account_exists"), 409
        users.append({
            "id": new_user_id(users),
            "displayName": name,
            "email": email,
            "passwordHash": generate_password_hash(password),  # never store the plain password
            "verified": False,
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "status": "visitor",
            "account": "Basic",
            "BooksRead": "0",
            "BooksBought": "0",
            "BooksUploaded": "0",
            "TotalReviews": "0",
        })
        save_users(users)

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

    with _lock:
        users = load_users()

    user = next((u for u in users if u.get("email", "").lower() == email.lower()), None)
    stored_hash = user.get("passwordHash", "") if user else _DUMMY_HASH
    password_ok = check_password_hash(stored_hash, password)

    # Same answer whether the email or the password was wrong
    if not user or not password_ok:
        return jsonify(error="Wrong email or password.", code="invalid_credentials"), 401

    return jsonify(ok=True, id=user.get("id"), displayName=user.get("displayName")), 200


def check_hash_cli():
    """Command-line helper: python app.py check
    Asks for an email and password and says whether they match data.json."""
    users = load_users()
    email = input("Email: ").strip().lower()
    user = next((u for u in users if u.get("email", "").lower() == email), None)
    if not user:
        print("NO ACCOUNT with that email in", DATA_FILE)
        return
    ok = check_password_hash(user.get("passwordHash", ""), getpass("Password (hidden): "))
    print("MATCH - login would succeed" if ok else "NO MATCH - login would be refused")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "check":
        check_hash_cli()
        sys.exit(0)
    if os.environ.get("SMTP_HOST"):
        print("Email mode: REAL SMTP via", os.environ["SMTP_HOST"])
    else:
        print("Email mode: MOCK - emails are only written to", EMAIL_LOG)
    app.run(host="127.0.0.1", port=5000, debug=True)
#
