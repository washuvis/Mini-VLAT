import sys
import math
import time
import os
from flask import Flask, request, jsonify
from flask.globals import session
import json
import random
import datetime
import secrets
import pandas as pd
import db_conf
from flask import send_file
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
app.config['MYSQL_DATABASE_HOST'] = db_conf.host
app.config['MYSQL_DATABASE_USER'] = db_conf.user
app.config['MYSQL_DATABASE_PASSWORD'] = db_conf.password
app.config['MYSQL_DATABASE_DB'] = db_conf.db
db_table_prefix = 'miniVlat'



global_session = {}

# Initialize Firebase only once
if not firebase_admin._apps:
    cred = credentials.Certificate("serviceAccountKey.json")  # Path to your key
    firebase_admin.initialize_app(cred)
db = firestore.client()

if __name__ == '__main__':
    app.run(debug=True)


print('ready')


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/get_time')
def get_time():
    return jsonify({'time': time.time()})


@app.route('/new_session_id', methods=['GET', 'POST'])
def get_new_session_id():
    """
        Returns a new session ID and sets up the session.
        """
    data = request.json
    print(data)

    # session id
    id = secrets.token_urlsafe(16)
    global_session[id] = {
    }

    # insert session into database
    '''
    conn = mysql.connect()
    cur = conn.cursor()
    sql_statement = f"insert into {db_table_prefix}_participants (id, data_condition, policy_condition, presentation_condition, tutorial_loaded_client_time, tutorial_loaded) values (" + ", ".join(
        [f"\"{str(item)}\"" for item in [id, data_condition, policy_condition, presentation_condition, tutorial_loaded_client_time, datetime.datetime.today()]]) + ")"
    cur.execute(sql_statement)
    conn.commit()
    cur.fetchall()
    conn.close()
    '''

    print('%d active users' % len(global_session.keys()))
    print(global_session.keys())

    return jsonify({'new_id': id})


@app.route('/record_responses_to_db', methods=['POST'])
def record_responses_to_db():
    data = request.json
    session_id = data['session_id']

    # Always save to txt file
    fname = str(session_id) + '.txt'
    fname = './surveys/quiz/' + fname
    with open(fname, 'w+') as test:
        test.write(json.dumps(data) + "\n")

    # Also try to save to Firestore
    try:
        db.collection('quiz_responses').document(session_id).set(data)
        print('Stored quiz data in Firestore:', data)
        firebase_status = "Firebase post succeeded"
    except Exception as e:
        print('Failed to store in Firestore:', e)
        firebase_status = f"Firebase post failed: {e}"

    return {'response': f"txt file saved; {firebase_status}"}
