# HPOS Admin HTTP API

## Access

Traffic to the API is directed by `HP Dispatcher` and access authorization and versioning is handled there.

## Endpoints

### `GET /config`

#### `200 OK`

Gets `hpos-config.json` `v1.settings`.

```json
{
    "admin": {
        "email": "sam.rose@holo.host",
        "public_key": "Tw7179WYi/zSRLRSb6DWgZf4dhw5+b0ACdlvAw3WYH8"
    },
    "name": "My HoloPort" // name is not in the default hpos-config.json file but can be added via PUT endpoint
}
```

#### `401 Unauthorized`

### `PUT /config`

Sets `hpos-config.json` `v1.settings`.

Requires `x-hp-admin-cas` header set to Base64-encoded SHA-512 hash of `GET
/v1/config` response body. Will only proceed if `holo-config.json` didn't
change.

Settings can take any valid json.

```json
{
    "admin": {
        "email": "sam.rose@holo.host",
        "name": "Holo Naut",
        "public_key": "z4NA8s70Wyaa2kckSQ3S3V3eIi8yLPFFdad9L0CY3iw"
    },

    "name": "My HoloPort",
    "myArbitraryField": ":)"
}
```

#### `200 OK`
#### `400 Bad Request`
#### `401 Unauthorized`
#### `409 Conflict`

Returned if CAS hash doesn't match current `hpos-state.json` `v1.config`.

### `GET /profiles/<profile>/features/<feature>`

Checks feature state (e.g. if it's enabled).
Note: currently the only profile (and the profile with SSH options) is `development`. I.e. `/profiles/development/features/ssh`

#### `200 OK`

- `enabled`: `true` if feature is enabled

```json
{
    "enabled": "boolean"
}
```

### `PUT /profiles/<profile>/features/<feature>`

Enables a feature.
Note: currently the only profile (and the profile with SSH options) is `development`. I.e. `/profiles/development/features/ssh`

#### `200 OK`

### `DELETE /profiles/<profile>/features/<feature>`

Disables a feature.
Note: currently the only profile (and the profile with SSH options) is `development`. I.e. `/profiles/development/features/ssh`

### `GET /status`

#### `200 OK`

Prints immutable HoloPort status data.

- `holo_nixpkgs.revs.channel` is the latest HoloPortOS version
- `holo_nixpkgs.revs.current_system` is currently installed HoloPortOS version
- `zerotier` field is verbatim `zerotier-cli -j info` output

```json
{
    "holo_nixpkgs": {
        "channel": {
            "name": "master",
            "rev": "b13891c28d78f1e916fdefb5edc1d386e4f533c8"
        },
        "current_system": {
            "rev": "4707080a5cba68e8bc215e22ef1c8e7d8e70791b"
        }
    }
}
```

### `POST /reset`

Executes a 'Factory Reset' that wipes all user and registration data from the HoloPort and reboots. Equivalent to the USB reset feature used by customer service.
Nothing is returned on success, since success wipes the HoloPort and disconnects the user from the HP admin UI.

#### `400 Bad Request`
#### `401 Unauthorized`

