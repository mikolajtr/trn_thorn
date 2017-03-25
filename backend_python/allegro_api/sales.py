import requests
import json

from allegro_api.credentials import api_url


def get_bids_bought(access_token):
    url = api_url + "/v1/allegro/my/bought?access_token=" + access_token
    req = requests.get(url)
    return json.loads(req.content)


def get_bids_active(access_token):
    url = api_url + "/v1/allegro/my/bids/active?access_token=" + access_token
    req = requests.get(url)
    return json.loads(req.content)
