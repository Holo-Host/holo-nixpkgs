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
    path = state_path()
    try:
        assert path, "Missing HPOS_STATE_PATH environment variable"
        with open(path, 'r') as f:
            config = json.load(f)
        return config['v1']['config']['admin']['email']
    except Exception as exc:
        logging.warning(f"Failed to get admin email from HPOS State in: {path}; {exc!r}")
        raise


def confirm_email(email, zerotier_address):
    logging.debug(f"Querying Holo authorization for email: {email}")
    auth = requests.post(HOLO_AUTH_URL, json={
        'addr': zerotier_address,
        'email': email,
        'pubkey': os.getenv('HOLO_PUBLIC_KEY')
    })
    logging.info(f"Holo authorization for email: {email} == {auth}")
    return auth


def zerotier_address():
    try:
        proc = subprocess.run(["zerotier-cli", "-j", "info"], capture_output=True, check=True)
        info = json.loads(proc.stdout)
    except Exception as exc:
        logging.warning(f"Failed to obtain Zerotier node address: {exc!r}")
        raise
    return info['address']


def main():
    confirm_email(admin_email(), zerotier_address())


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    main()
