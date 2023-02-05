import sys
import math
import time
import os
from flask import Flask, request, jsonify
from flask.globals import session
#from flaskext.mysql import MySQL
import json
import random
import datetime
import secrets
#import numpy as np
import pandas as pd
import db_conf
from flask import send_file
#from flask_mail import Mail, Message
#import firebase_admin
#from firebase_admin import credentials, firestore, initialize_app, firebase

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
app.config['MYSQL_DATABASE_HOST'] = db_conf.host
app.config['MYSQL_DATABASE_USER'] = db_conf.user
app.config['MYSQL_DATABASE_PASSWORD'] = db_conf.password
app.config['MYSQL_DATABASE_DB'] = db_conf.db
db_table_prefix = 'miniVlat'
#mail = Mail(app)

# app.config['MAIL_SERVER'] = 'smtp.gmail.com'
# app.config['MAIL_PORT'] = 465
# app.config['MAIL_USERNAME'] = 'minivlat@gmail.com'
# app.config['MAIL_PASSWORD'] = "minivlat123"
# app.config['MAIL_USE_TLS'] = False
# app.config['MAIL_USE_SSL'] = True
#mail = Mail(app)

#mysql = MySQL()
# mysql.init_app(app)

global_session = {}

#cred = credentials.Certificate("securekey.json")
#default_app = initialize_app(cred)
#db = firestore.client()

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
    #fname = str(session_id)+'.txt'
    #fname = './surveys/quiz/' + fname
    # with open(fname, 'w+') as test:
    #    test.write(json.dumps(data) + "\n")
    #res = firebase.post(data_send)
    # data_send = json.dumps(data)
    # msg = Message("Quiz Response for " + str(session_id),sender='minivlat@gmail.com', recipients=['minivlat@gmail.com'])
    # msg.body = data_send
    # mail.send(msg)
    fname = str(session_id)+'.txt'
    fname = './surveys/quiz/' + fname
    with open(fname, 'w+') as test:
        test.write(json.dumps(data) + "\n")

    print('TODO: Record quiz responses into a file or DB')
    print('Collected quiz data: ', data)
    return {'response': "json post succeeded"}


# @app.route('/record_survey_to_db', methods=['POST'])
# def record_survey_to_db():
#     data = request.json
#     session_id = data['session_id']

#     #fname = str(session_id)+'.txt'
#     #fname = './surveys/demographicResponses/' + fname
#     # with open(fname, 'w+') as test2:
#     #    test2.write(json.dumps(data) + "\n")
#     #res = firebase.post(data_send)
#     # data_send = json.dumps(data)
#     # msg = Message("Demographic Response for " + str(session_id),sender='minivlat@gmail.com', recipients=['minivlat@gmail.com'])
#     # msg.body = data_send
#     # mail.send(msg)
#     fname = str(session_id) + '.txt'
#     fname = './surveys/demographicResponses/' + fname
#     with open(fname, 'w+') as test2:
#         test2.write(json.dumps(data) + "\n")

#     print('TODO: Record survey responses into a file or DB')
#     print('Collected survey data: ', data)
#     return {'response': "json post succeeded"}
