from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

class FB_Database:
    def __init__(self, FB_db_path='./Database/database.db'):
        self.FB_db_path = FB_db_path
        self.conn = None
        self.cursor = None
        self.connect()
        self.Main_data()
        self.Info = 'Arranging all FB data'

   
    def connect(self):

        FB_dir = os.path.dirname(self.FB_db_path)
        if not os.path.exists(FB_dir):
            os.makedirs(FB_dir)
        self.conn = sqlite3.connect(self.FB_db_path, check_same_thread=False)
        self.cursor = self.conn.cursor()
        print(f"Have connected the database through {self.FB_db_path}")



    def Main_data(self):
        query = """
            CREATE TABLE IF NOT EXISTS main_data(
                id INTEGER PRIMARY KEY,
                Email TEXT,
                Permit INTEGER
            )
        """
        self.cursor.execute(query)
        self.conn.commit()

    def save_email(self, email):
        query = """INSERT INTO main_data(Email) VALUES(?)"""
        self.cursor.execute(query, (email,))
        self.conn.commit()

    def save_permit(self, email, permit):
        query = """UPDATE main_data SET Permit = ? WHERE Email = ?"""
        self.cursor.execute(query, (permit, email))
        self.conn.commit()

    def close(self):
        if self.conn:
            self.conn.close()
            print(f'FB db Closed connection {self.Info}')

FB = FB_Database()

@app.route('/')
def index():
    return render_template('For_Phone.html')

@app.route('/save-email', methods=['POST'])
def save_email():
    data = request.json
    if 'email' not in data:
        return jsonify({'error': 'Missing email'}), 400
    try:
        FB.save_email(data['email'])
        return jsonify({'message':'Email saved successfully!'}), 200
    except Exception as e:
        return jsonify({'error':str(e)}), 500

@app.route('/save-permit', methods=['POST'])
def save_permit():
    data = request.json
    if 'email' not in data or 'permit' not in data:
        return jsonify({'error': 'Missing email or permit'}), 400
    try:
        FB.save_permit(data['email'], data['permit'])
        return jsonify({'message':'Permit saved successfully!'}), 200
    except Exception as e:
        return jsonify({'error':str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)