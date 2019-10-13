import json
import logging
import requests
import subprocess
import sys

HOLO_AUTH_URL = "https://auth.holo.host/v1/confirm-email"
HOLO_CONFIG_PATH = "/media/keys/holo-config.json"


def admin_email():
    with open(HOLO_CONFIG_PATH, 'r') as f:
        config = json.load(f)
    return config['v1']['admin']['email']


def confirm_email(email, zerotier_address):
    return requests.post(HOLO_AUTH_URL, {
        'email': email,
        'zerotier_address': zerotier_address
    })


def zerotier_address():
    proc = subprocess.run(["zerotier-cli", "-j", "info"], capture_output=True)
    info = json.loads(proc.stdout)
    return info['address']


def main():
    logging.debug(confirm_email(admin_email(), zerotier_address()))


if __name__ == "__main__":
    main()
