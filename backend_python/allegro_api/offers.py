import json

import requests

from allegro_api.credentials import api_url


def buy_item_from_offers(offer_id, **kwargs):
    url = api_url + "/v1/allegro/offers/" + offer_id + "/buy"
    req = requests.post(url, data=kwargs)
    if req.status_code != 200:
        return str(json.loads(req.content)["userMessage"]), req.status_code
    deal = json.loads(req.content)["deal"]
    message = json.loads(req.content)["message"]
    return json.dumps({"deal": deal, "message": message}), req.status_code