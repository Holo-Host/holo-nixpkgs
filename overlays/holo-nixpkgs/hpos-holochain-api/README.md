# hpos-holochain-api

The hpos-holochina-api is an express server that exposes endpoints that interact with holochain(i.e conductor) that is running in hpos.

## Exposed Endpoints

### 1. `GET /hosted_happs`
**Response Body:**
```json
  [{
    "id": "uhCkkyw_BVJPyrv469jrFjzpAMS3toP4bctbbqmtzcEXUUSX5vEOh",
    "name": "Elemental Chat",
    "enabled": "true",
    "source_chain": 3
  },{
    "id": "uhCkkyw_FSJPyrv469jrFjzpAMS3toP4bctbbqmtzcEXUUSX5vEOh",
    "name": "Holofuel",
    "enabled": "false",
    "source_chain": 0
  }]
```

### 2. `POST /install_hosted_happ`
This endpoint is called to install/enable a hosted happ by passing the happ_id and preferences to set up the servicelogger instance

**Request Body**
```json
{
    "happ_id": "uhCkkyw_BVJPyrv469jrFjzpAMS3toP4bctbbqmtzcEXUUSX5vEOh",
    "preferences": {
        "max_fuel_before_invoice": 1,
        "max_time_before_invoice": [80000, 0],
        "price_compute": 1,
        "price_storage": 2,
        "price_bandwidth": 1
    }
}
```
**Response**
`HTTP STATUS 200`


## Testing
- ### Testing locally:
  - See that you are root of the `/hpos-holochain-api/` folder
  - `npm install`
  - To get the dna for testing run `npm run fetch-dnas`
  - In one terminal run `npm run holochain`
  - In a new terminal run `npm test` to test out this module

- ### Testing on hpos:

    Use `nix-build tests` to run tests in sandbox.

    **Note:** The `/install_hosted_happ` endpoint cannot be tested in sandbox because it requires internet access. So see that you turn off sandbox mode when testing it.
    To turn off sandbox mode use the following command
    `nix-build tests --no-sandbox`
