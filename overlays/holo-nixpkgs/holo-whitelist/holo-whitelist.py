import json
import requests
import subprocess

def main():
    #temp creation of json
    data = {
            "email":"test@test.com"
    }
    with open('/var/lib/data.json', 'w') as outfile:
        json.dump(data, outfile)
    #end temp
    path = '/var/lib/data.json'
    datafile = open(path, 'r')    
    loadedjson = json.load(datafile)
    get_zt = subprocess.run(["zerotier-cli", "-j", "info"], capture_output=True)
    #print(get_zt)
    ztjson = json.loads(get_zt.stdout.decode('utf-8'))
    print(ztjson)
    payload = {
            'zt_address' : ztjson['address'],
            'email' : loadedjson['email']
    }
    url = "https://postb.in/1569524307575-7521095054689"
    r = requests.post(url,payload)
    print(r.text)

if __name__ == "__main__":
    main()
