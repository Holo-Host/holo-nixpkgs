from base64 import b64encode
from hashlib import sha512
import click
import json
import requests


@click.group()
@click.option('--url', help='HPOS Holochain HTTP URL')
@click.pass_context
def cli(ctx, url):
    ctx.obj['url'] = url

def request(ctx, method, path, **kwargs):
    return requests.request(method, ctx.obj['url'] + path, **kwargs)

@cli.command(help='Get info on happs currently hosted')
@click.pass_context
def hosted_happs(ctx):
    print(request(ctx, 'GET', '/hosted_happs').json())

@cli.command(help='Pass a happ_id to be installed as a hosted happ')
@click.argument('happ_id')
@click.argument('max_fuel_before_invoice')
@click.argument('max_time_before_invoice')
@click.argument('price_compute')
@click.argument('price_storage')
@click.argument('price_bandwidth')
@click.pass_context
def install_hosted_happ(ctx, happ_id, max_fuel_before_invoice, max_time_before_invoice, price_compute, price_storage, price_bandwidth):
    preferences = {
        "max_fuel_before_invoice": max_fuel_before_invoice,
        "max_time_before_invoice": max_time_before_invoice,
        "price_compute": price_compute,
        "price_storage": price_storage,
        "price_bandwidth": price_bandwidth,
    }
    print(request(ctx, 'POST', '/install_hosted_happ',  data=json.dumps({'happ_id': happ_id, 'preferences': preferences })))

if __name__ == '__main__':
    cli(obj={})
