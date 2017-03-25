import json

import requests

from credentials import api_url


def get_watched_active(access_token):
    url = api_url + "/v1/allegro/my/watched/active?access_token=" + access_token
    req = requests.get(url)
    return json.loads(req.content)
