import json
import logging
import os
import requests
import subprocess
import sys

HOLO_AUTH_URL = "https://authorizer.holohost.net/v1/auth"


def state_path():
    return os.getenv('HPOS_STATE_PATH')


def admin_email():
    with open(state_path(), 'r') as f:
        config = json.load(f)
    return config['v1']['config']['admin']['email']


def confirm_email(email, zerotier_address):
    return requests.post(HOLO_AUTH_URL, json={
        'addr': zerotier_address,
        'email': email,
        'pubkey': 'public_key'
    })


def zerotier_address():
    proc = subprocess.run(["zerotier-cli", "-j", "info"], capture_output=True)
    info = json.loads(proc.stdout)
    return info['address']


def main():
    logging.debug(confirm_email(admin_email(), zerotier_address()))


if __name__ == "__main__":
    main()
