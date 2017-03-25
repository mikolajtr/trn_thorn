import json

import requests

from credentials import api_url


def get_bargains(access_token):
    url = api_url + "/v1/allegro/bargains?access_token=" + access_token
    req = requests.get(url)
    return json.loads(req.content)