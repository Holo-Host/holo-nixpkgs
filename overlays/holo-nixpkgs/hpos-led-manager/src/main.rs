use aorura::*;
use docopt::Docopt;
use failure::*;
use serde::*;
use serde_json::{Result, Value};

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

#[tokio::get_hydra_revision]
async fn get_hydra_revision() {
    let channel = fs::read_to_string("/root/.nix-channel")  // need to parse this for the channel name 
                            .expect("Something went wrong reading the file");

                           
        eval_url = "https://hydra.holo.host/jobset/holo-nixpkgs/" + channel + "/latest-eval"
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

    let res = reqwest::get(eval_url).await?; // How to add headers here?
    let eval_summary: Value = serde_json::from_str(res)?; 
    return revision["jobsetevalinputs"]["holo-nixpkgs"]["revision"]
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

    // Run get_hydra_revision once every 5 minutes if running it in the loop is too taxing?

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

        let hydra_revision = get_hydra_revision()
        let local_revision = fs::read_to_string("/root/.nix-revision")
                            .expect("Something went wrong reading the file");
        let update_required = local_revision == hydra_revision // If this lights up then it's likely the updater isn't working properly

        let TLS_certificate: Value = serde_json::from_reader("/var/lib/acme/default/account_reg.json")?; 
        let TLS_certificate_valid = TLS_certificate["body"]["status"] == "valid" // Note that the TLS_certificate returns a borrow (&value)

        let system_error = false // true if any of the following services are in a failed state: holochain-conductor.service, hp-admin-crypto-server.service, hpos-admin.service, nginx.service, zerotierone.service. Important: FAILED only not missing. holochain-conductor might not be on Nano at first.
        let hosting_error = false // true if the following services are in a failed state: holo-auth-client.service, hpos-init.service, 

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
