import json
import logging
import requests
import subprocess
import sys

URL = "https://auth.holo.host/v1/confirm-email"
PATH = "/media/keys/holo-config.json"


def email():
    with open(PATH, 'r') as f:
        loaded_json = json.load(f)
        email_data = loaded_json['email']
    return email_data


def whitelist_req(email, zerotier_address):
    payload = {
        'zerotier_address': zerotier_address,
        'email': email
    }
    r = requests.post(URL, payload)
    return r


def zerotier_address():
    proc = subprocess.run(["zerotier-cli", "-j", "info"], capture_output=True)
    zt_data = json.loads(proc.stdout)
    zerotier_address = zt_data['address']
    return zerotier_address


def main():
    log = logging.getLogger(__name__)
    out_hdlr = logging.StreamHandler(sys.stdout)
    out_hdlr.setFormatter(logging.Formatter('%(asctime)s %(message)s'))
    out_hdlr.setLevel(logging.INFO)
    log.addHandler(out_hdlr)
    log.setLevel(logging.INFO)
    user_email = email()
    address = zerotier_address()
    request = whitelist_req(user_email, address)
    log.info(request.text)


if __name__ == "__main__":
    main()
