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
@click.argument('amount')
@click.argument('duration_unit')
@click.pass_context
def hosted_happs(ctx, amount, duration_unit):
    print(request(ctx, 'GET', f"/hosted_happs?duration_unit={duration_unit}&amount={amount}").text)

@cli.command(help='Get info for the host-console-ui dashboard')
@click.argument('amount')
@click.argument('duration_unit')
@click.pass_context
def dashboard(ctx, amount, duration_unit):
    print(request(ctx, 'GET', f"/dashboard?duration_unit={duration_unit}&amount={amount}").text)

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

@cli.command(help='Pass a url to be registered for EC happ bundle in HHA')
@click.argument('url')
@click.pass_context
def register_happ(ctx, url):
    print(request(ctx, 'POST', '/register_happ',  data=json.dumps({'url': url })))

if __name__ == '__main__':
    cli(obj={})
