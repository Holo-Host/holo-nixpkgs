import json
import logging
import requests
import subprocess
import sys

URL = "https://postman-echo.com/post"
PATH = "/var/lib/data.json"


def email():
    with open(PATH, 'r') as f:
        loaded_json = json.load(f)
        email_data = loaded_json['email']
    return email_data


def whitelist_req(email, zt_address):
    payload = {
        'zt_address': zt_address,
        'email': email
    }
    r = requests.post(URL, payload)
    return r


def zt_address():
    proc = subprocess.run(["zerotier-cli", "-j", "info"], capture_output=True)
    zt_data = json.loads(proc.stdout)
    zt_address = zt_data['address']
    return zt_address


def main():
    log = logging.getLogger(__name__)
    out_hdlr = logging.StreamHandler(sys.stdout)
    out_hdlr.setFormatter(logging.Formatter('%(asctime)s %(message)s'))
    out_hdlr.setLevel(logging.INFO)
    log.addHandler(out_hdlr)
    log.setLevel(logging.INFO)
    user_email = email()
    address = zt_address()
    request = whitelist_req(user_email, address)
    log.info(request.text)


if __name__ == "__main__":
    main()
