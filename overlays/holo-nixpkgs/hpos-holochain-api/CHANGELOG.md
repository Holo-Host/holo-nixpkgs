# Changelog

This is changelog only covers hpos-holochain-api.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),

## unreleased

### Changed
- `hosted_happs` and `dashboard` endpoints now take query string arguments instead of using the request body

### Fixed
- Catches potential JSON parse error in `install_hosted_happ` endpoint.
