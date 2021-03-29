# hpos-holochain-api

The hpos-holochina-api is an express server that exposes endpoints that interact with holochain(i.e conductor) that is running in hpos.

## Exposed Endpoints

### 1. `GET /hosted_happs`
This endpoint is called to read all current hosted happs and return the usage data for each by passing the usageTimeInterval object to query usage entry data in each servicelogger instance

**Request Body**
```json
{
  "duration_unit": "WEEK", // type String (OPTIONS: "DAY" | "WEEK" | "MONTH" | "YEAR")
  "amount": 1 // type Int
}
```

**Response Body:**
#### Response with all successful servicelogger calls
`HTTP STATUS 200`:
```json
  [{ // enabled app with usage stats
    "id": "uhCkkyw_BVJPyrv469jrFjzpAMS3toP4bctbbqmtzcEXUUSX5vEOh",
    "name": "Elemental Chat",
    "enabled": "true",
    "sourceChains": 3,
    "usage" : {
      "bandwidth": 10,
      "cpu": 7
    },
  },{ // unregisted servicelogger for app
    "id": "uhCkkinFSJP_yrv469jrFjzpAMS3toP4bctbbqmtzcEXUUSX5vL3i",
    "name": "Holo Wiki",
    "enabled": "false",
    "error" : {
      "source": "uhCkkinFSJP_yrv469jrFjzpAMS3toP4bctbbqmtzcEXUUSX5vL3i::servicelogger",
      "message": "error message",
      "stack": "error stack: error at line /... /..."
    }
  }]
```
`bandwidth` and `storage` are both presented as number of bytes. `cpu` as number of *microseconds*.

### 2. `GET /dashboard`
Returns data for the dashboard page of host-console. Mostly usage data aggregated across all happs.

**Request Body**
```json
{
  "duration_unit": "DAY", // type String (OPTIONS: "DAY" | "WEEK" | "MONTH" | "YEAR")
  "amount": 1 // type Int
}
```

**Response Body:**
#### Response with all successful servicelogger calls
`HTTP STATUS 200`:
```javascript
{
  totalSourceChains: 10,
  currentTotalStorage: 2000,
  usage: {
    cpu: 100,
    bandwidth: 3000
  }
}
```
`bandwidth` and `currentTotalStorage` are both presented as number of *bytes*. `cpu` as number of *microseconds*.

### 3. `POST /install_hosted_happ`
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
  - `yarn install`
  - To get the dna for testing run `npm run fetch-dnas`
  - In one terminal run `npm run holochain`
  - In a new terminal run `npm test` to test out this module

- ### Testing on hpos:

    Use `nix-build tests` to run tests in sandbox.

    **Note:** The `/install_hosted_happ` endpoint cannot be tested in sandbox because it requires internet access. So see that you turn off sandbox mode when testing it.
    To turn off sandbox mode use the following command
    `nix-build tests --no-sandbox`
