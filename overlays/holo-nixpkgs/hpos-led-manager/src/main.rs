use aorura::*;
use docopt::Docopt;
use failure::*;
use serde::*;

use std::env;
use std::fs;
use std::net::{TcpStream, ToSocketAddrs};
use std::path::{Path, PathBuf};
use std::thread::sleep;
use std::time::Duration;

const POLLING_INTERVAL: u64 = 1;

const USAGE: &'static str = "
Usage: hpos-led-manager --device <path> --state <path>
       hpos-led-manager --help

Manages AORURA LED.

Options:
  --device <path>  Path to AORURA device
  --state <path>   Path to state JSON file
";

#[derive(Debug, Deserialize)]
struct Args {
    flag_device: PathBuf,
    flag_state: PathBuf,
}

fn main() -> Fallible<()> {
    let args: Args = Docopt::new(USAGE)?
        .argv(env::args())
        .deserialize()
        .unwrap_or_else(|e| e.exit());

    let mut led = Led::open(&args.flag_device)?;

    let mut state_prev: State = Default::default();
    let state_path = args.flag_state;
    let state_temp_path = state_path.with_extension("tmp");

    loop {
        let router_gateway_addrs = "router-gateway.holo.host:80".to_socket_addrs();
        let online = match router_gateway_addrs {
            Ok(mut addrs) => match addrs.next() {
                Some(addr) => TcpStream::connect_timeout(&addr, Duration::new(1, 0)).is_ok(),
                None => false,
            },
            Err(_) => false,
        };

        let hpos_config_found = Path::new("/run/hpos-init/hpos-config.json").exists();

        // let TLS_certificate_valid = check that certificate is valid without querying simp_le or acme service

        // let update_required = current_holo_nixpkgs_revision == hydra_channel_holo_nixpkgs_revision. We could use this delta to show when a HoloPort is in the update process?

        let system_error = false // If any system services are throwing errors
        let hosting_error = false // Can be replaced with errors to do with DNAs if holochain can report them

        let state = match (system_error, hosting_error, !online, update_required, !hpos_config_found, !TLS_certificate_valid) {
            (true, _) => State::Flash(Color::Red),
            (false, true, _) => State::Flash(Color::Yellow),
            (false, false, true, _) => State::Flash(Color::Purple),
            (false, false, false, true, _) => State::Static(Color::Blue),
            (false, false, false, false, true, _) => State::Flash(Color::Green),
            (false, false, false, false, false, true) => State::Static(Color::Green),
            _ => State::Aurora,
        };

        if state != state_prev {
            led.set(state)?;
            state_prev = state;
        }

        fs::write(&state_temp_path, serde_json::to_vec(&state)?)?;
        fs::rename(&state_temp_path, &state_path)?;

        sleep(Duration::new(POLLING_INTERVAL, 0));
    }
}
