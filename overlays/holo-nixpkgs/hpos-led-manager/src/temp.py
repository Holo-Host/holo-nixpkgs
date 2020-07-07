def hydra_channel():
    with open('/root/.nix-channels') as f:
        channel_url = f.read()
    return channel_url.split('/')[6]


def hydra_revision():
    channel = hydra_channel()
    eval_url = 'https://hydra.holo.host/jobset/holo-nixpkgs/' + channel + '/latest-eval'
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    eval_summary = requests.get(eval_url, headers=headers).json()
    return eval_summary['jobsetevalinputs']['holo-nixpkgs']['revision']


def local_revision():
    try:
        with open('/root/.nix-revision') as f:
            local_revision = f.read()
    except:
        local_revision = 'unversioned'
    return local_revision