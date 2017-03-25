from flask import Flask
from flask import json
from flask import request

from allegro_api.auth import authenticate

app = Flask(__name__)


@app.route("/auth/login", methods=['POST'])
def authorize():
    data = json.loads(request.data)
    auth_data = authenticate(data["username"], data["password"])
    return auth_data

if __name__ == "__main__":
    app.run()