"""
원고지 (Manuscript) — a tiny blog
Flask serves the pages. Firebase (Auth + Firestore) handles
sign-up/login and storing posts, straight from the browser.
"""
import os
from flask import Flask, render_template

app = Flask(__name__)

# ---------------------------------------------------------------------------
# Firebase web config — these are PUBLIC client keys (safe to ship to the
# browser). Set them as Environment Variables in your Vercel project, or
# export them locally before running `flask run`.
# Get them from: Firebase Console → Project settings → General → "Your apps"
# ---------------------------------------------------------------------------
FIREBASE_CONFIG = {
    "apiKey": os.environ.get("FIREBASE_API_KEY", ""),
    "authDomain": os.environ.get("FIREBASE_AUTH_DOMAIN", ""),
    "projectId": os.environ.get("FIREBASE_PROJECT_ID", ""),
    "storageBucket": os.environ.get("FIREBASE_STORAGE_BUCKET", ""),
    "messagingSenderId": os.environ.get("FIREBASE_MESSAGING_SENDER_ID", ""),
    "appId": os.environ.get("FIREBASE_APP_ID", ""),
}


@app.context_processor
def inject_firebase_config():
    return {"firebase_config": FIREBASE_CONFIG}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login")
def login():
    return render_template("login.html")


@app.route("/signup")
def signup():
    return render_template("signup.html")


@app.route("/write")
def write():
    return render_template("write.html")


@app.route("/post/<post_id>")
def post_detail(post_id):
    return render_template("post.html", post_id=post_id)


# Vercel's Python runtime looks for a WSGI callable named `app`.
if __name__ == "__main__":
    app.run(debug=True, port=5000)
