import json

import requests

from allegro_api.credentials import api_url


def get_categories(access_token):
    url = api_url + "/v1/allegro/categories?access_token=" + access_token
    req = requests.get(url)
    return json.loads(req.content)
