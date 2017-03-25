import time

from auth import authenticate
from bargains import get_bargains
from credentials import sample_username, sample_password
from watched import get_watched_active

user_data = authenticate(sample_username, sample_password)
access_token = user_data["access_token"]
time.sleep(60)
bargains = get_bargains(access_token)
print(bargains)
