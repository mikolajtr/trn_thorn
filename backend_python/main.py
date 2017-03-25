from flask import Flask
from flask import json
from flask import request

from allegro_api.auth import authenticate
import allegro_api.bargains as bargains
from allegro_api.categories import get_categories
from allegro_api.offers import buy_item_from_offers
from allegro_api.sales import get_bids_bought, get_bids_active
from allegro_api.watched import get_watched_active
from db_access import DbContext

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


@app.route("/sales/summary", methods=['POST'])
def sales_summary():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    db = DbContext()
    summary = db.summary(start_date, end_date)
    return json.dumps(summary)


@app.route("/categories/<id>", methods=['POST'])
def get_category(id):
    data = json.loads(request.data)
    access_token = data["access_token"]
    return json.dumps(get_categories(access_token))

if __name__ == "__main__":
    app.run()
