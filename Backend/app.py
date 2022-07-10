import sqlite3
from hashids import Hashids
from flask import Flask, request, flash, redirect, url_for, jsonify
from flask_cors import CORS


def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

app = Flask(__name__)
app.config['SECRET_KEY'] = '62e8f6980b724f83f2bb4a'
CORS(app)

hashids = Hashids(min_length=4, salt=app.config['SECRET_KEY'])

@app.route('/add/<url>')
def add_url(url):
    conn = get_db_connection()

    if not url:
        flash('The URL is required!')
        return redirect(url_for('index'))

    url_data = conn.execute('INSERT INTO urls (original_url) VALUES (?)',
                            (url,))
    conn.commit()
    conn.close()

    url_id = url_data.lastrowid
    hashid = hashids.encode(url_id)
    short_url = request.host_url + hashid
    return jsonify(short_url)


@app.route('/<id>')
def url_redirect(id):
    conn = get_db_connection()

    original_id = hashids.decode(id)
    if original_id:
        original_id = original_id[0]
        url_data = conn.execute('SELECT original_url, clicks FROM urls'
                                ' WHERE id = (?)', (original_id,)
                                ).fetchone()
        original_url = url_data['original_url']
        clicks = url_data['clicks']

        conn.execute('UPDATE urls SET clicks = ? WHERE id = ?',
                     (clicks+1, original_id))

        conn.commit()
        conn.close()
        return redirect('https://' + original_url)
    else:
        flash('Invalid URL')
        return redirect(url_for('index'))

@app.route('/stats')
def stats():
    conn = get_db_connection()
    db_urls = conn.execute('SELECT id, created, original_url, clicks FROM urls'
                           ).fetchall()
    conn.close()

    urls = []
    for url in db_urls:
        url = dict(url)
        url['short_url'] = request.host_url + hashids.encode(url['id'])
        urls.append(url)

    return jsonify(urls), 222
