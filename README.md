# URL Shortener
## Installation
| | Version |
| --- | --- |
| Python | 3.10.5 |
| Flask | 2.1.2 |
| Werkzeug | 2.1.2 |
| NodeJs | 16.16.0 |
| NPM | 8.11.0 |

## Backend
Run on initialization
```
cd Backend
python -m venv env
source env/bin/activate # Linux
./env/Scripts/activate # For Windows
python -m pip install --upgrade pip
pip install -r requirements.txt
python init_db.py
```

To start backend
```
cd Backend
# Activate env
flask run
```

Helpful commands
```
pip install <Package Name>
pip freeze > requirements.txt
```

## Frontend
```
npm install
ng serve // Goto http://localhost:4200/

```

## Heroku
Hosted on: https://quiet-depths-37968.herokuapp.com/
However, as sqlite3 is supported by herokuapp, I am unable to test this.

Push only the backend folder into heroku
`git subtree push --prefix Backend/ heroku main`
