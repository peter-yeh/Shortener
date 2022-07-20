import sqlite3
from hashids import Hashids
from flask import Flask, request, flash, redirect, url_for, jsonify, render_template
from flask_cors import CORS


def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

app = Flask(__name__)
app.config['SECRET_KEY'] = '62e8f6980b724f83f2bb4a'
CORS(app)

hashids = Hashids(min_length=4, salt=app.config['SECRET_KEY'])


@app.route('/')
def index():
    return render_template('index.html')

if __name__=="__main__":
    app.run()

@app.route('/add', methods = ['POST'])
def add_url():
    conn = get_db_connection()
    url = request.json.get('url')

    if not url:
        flash('The URL is required!')
        return redirect(url_for('index'))

    url_data = conn.execute('INSERT INTO urls (originalUrl) VALUES (?)',
                            (url,))
    conn.commit()
    conn.close()

    url_id = url_data.lastrowid
    hashid = hashids.encode(url_id)
    shortUrl = request.host_url + hashid
    return jsonify(shortUrl), 200

@app.route('/<id>')
def url_redirect(id):
    conn = get_db_connection()

    original_id = hashids.decode(id)
    if original_id:
        original_id = original_id[0]
        url_data = conn.execute('SELECT originalUrl, clicks FROM urls'
                                ' WHERE id = (?)', (original_id,)
                                ).fetchone()
        originalUrl = url_data['originalUrl']
        clicks = url_data['clicks']

        conn.execute('UPDATE urls SET clicks = ? WHERE id = ?',
                     (clicks+1, original_id))

        conn.commit()
        conn.close()
        return redirect(originalUrl)
    else:
        flash('Invalid URL')
        return redirect(url_for('index'))

@app.route('/stats')
def stats():
    conn = get_db_connection()
    db_urls = conn.execute('SELECT id, created, originalUrl, clicks FROM urls'
                           ).fetchall()
    conn.close()

    urls = []
    for url in db_urls:
        url = dict(url)
        url['shortUrl'] = request.host_url + hashids.encode(url['id'])
        urls.append(url)

    return jsonify(urls), 200


# Expects id of the row we want to delete
@app.route('/delete/<id>')
def delete_url(id):
    conn = get_db_connection()
    try:
        conn.execute('DELETE FROM urls WHERE id = (?)', (id))
    except:
        conn.close()
        return jsonify('Entry does not exist'), 400
        
    conn.commit()
    conn.close()

    return jsonify('Deleted entry'), 200
