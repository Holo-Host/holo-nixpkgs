from base64 import b64encode
from hashlib import sha512
import click
import json
import requests


@click.group()
@click.option('--url', help='HPOS Admin HTTP URL')
@click.pass_context
def cli(ctx, url):
    ctx.obj['url'] = url


def request(ctx, method, path, **kwargs):
    return requests.request(method, ctx.obj['url'] + path, **kwargs)


def get_settings_inner(ctx):
    return request(ctx, 'GET', '/config').json()


@cli.command(help='Get hpos-config.json v1.settings')
@click.pass_context
def get_settings(ctx):
    print(get_settings_inner(ctx))


def cas_hash(data):
    dump = json.dumps(data, separators=(',', ':'), sort_keys=True)
    return b64encode(sha512(dump.encode()).digest()).decode()


@cli.command(help='Set hpos-config.json v1.settings and trigger NixOS rebuild')
@click.argument('k')
@click.argument('v')
@click.pass_context
def put_settings(ctx, k, v):
    config = get_settings_inner(ctx)
    cas_hash1 = cas_hash(config)
    config[k] = v

    res = request(ctx, 'PUT', '/config',
                  headers={'x-hpos-admin-cas': cas_hash1},
                  json=config)
    assert res.status_code == requests.codes.ok


@cli.command(help='Get state of an HPOS feature')
@click.argument('profile')
@click.argument('feature')
@click.pass_context
def get_feature_state(ctx, profile, feature):
    print(request(ctx, 'GET', f'/profiles/{profile}/features/{feature}').json())


@cli.command(help='Enable an HPOS feature')
@click.argument('profile')
@click.argument('feature')
@click.pass_context
def enable_feature(ctx, profile, feature):
    print(request(ctx, 'PUT', f'/profiles/{profile}/features/{feature}').json())


@cli.command(help='Disable an HPOS feature')
@click.argument('profile')
@click.argument('feature')
@click.pass_context
def disable_feature(ctx, profile, feature):
    print(request(ctx, 'DELETE', f'/profiles/{profile}/features/{feature}').json())


@cli.command(help='Get HoloPortOS status data')
@click.pass_context
def get_status(ctx):
    print(request(ctx, 'GET', '/status').json())


@cli.command(help='Get info on happs currently hosted')
@click.pass_context
def get_hosted_happs(ctx):
    print(request(ctx, 'GET', '/hosted_happs').json())

@cli.command(help='Initiate a factory reset')
@click.pass_context
def factory_reset(ctx):
    res = request(ctx, 'POST', '/reset')
    if res.status_code == 400:
        print("Failed to reset device")


if __name__ == '__main__':
    cli(obj={})
