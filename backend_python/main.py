from flask import Flask
from flask import json
from flask import request

from allegro_api.auth import authenticate
import allegro_api.bargains as bargains
from allegro_api.offers import buy_item_from_offers
from allegro_api.sales import get_bids_bought, get_bids_active
from allegro_api.watched import get_watched_active

app = Flask(__name__)


@app.route("/auth/login", methods=['POST'])
def authorize():
    data = json.loads(request.data)
    auth_data = authenticate(data["username"], data["password"])
    return auth_data


@app.route("/bargains", methods=['POST'])
def bargains():
    data = json.loads(request.data)
    access_token = data["access_token"]
    return json.dumps(bargains.get_bargains(access_token))


@app.route("/bids/bought", methods=['POST'])
def bids_bought():
    data = json.loads(request.data)
    access_token = data["access_token"]
    return json.dumps(get_bids_bought(access_token))


@app.route("/bids/active", methods=['POST'])
def bids_active():
    data = json.loads(request.data)
    access_token = data["access_token"]
    return json.dumps(get_bids_active(access_token))


@app.route("/watched/active", methods=['POST'])
def watched_active():
    data = json.loads(request.data)
    access_token = data["access_token"]
    return json.dumps(get_watched_active(access_token))


@app.route("/offers/<offer_id>/buy", methods=['POST'])
def buy_item(offer_id):
    data = json.loads(request.data)
    return json.dumps(buy_item_from_offers(offer_id, **data))


if __name__ == "__main__":
    app.run()
