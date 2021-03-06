import base64
import hashlib
import json

import requests
from oauthlib.oauth2 import BackendApplicationClient
from requests_oauthlib import OAuth2Session

from allegro_api.credentials import token_url, client_id, client_secret


def get_sha256(text):
    return hashlib.sha256(text.encode()).digest()


def get_base64(text):
    return base64.b64encode(text)


def get_access_token(token_url, client_id, client_secret):
    client = BackendApplicationClient(client_id=client_id)
    oauth = OAuth2Session(client=client)
    access_data = oauth.fetch_token(token_url=token_url,
                                    client_id=client_id,
                                    client_secret=client_secret)
    return access_data["access_token"]


def login_user(username, password, token):
    data = {"userLogin": username,
            "hashPass": get_base64(get_sha256(password)),
            "access_token": token}
    req = requests.post("https://api.natelefon.pl/v1/allegro/login", data=data)

    if req.status_code != 200:
        return str(json.loads(req.content)["userMessage"]), req.status_code
    userId = json.loads(req.content)["userId"]
    return json.dumps({"access_token": token, "user_id": userId}), req.status_code


def authenticate(username, password):
    access_token = get_access_token(token_url, client_id, client_secret)
    user_data = login_user(username, password, access_token)
    return user_data
