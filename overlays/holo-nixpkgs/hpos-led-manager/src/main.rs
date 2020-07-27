use anyhow::{Context, Result};
use aorura::*;
use docopt::Docopt;
use reqwest::*;
use serde::*;
use serde_json::Value;

use std::env;
use std::fs;
use std::net::{TcpStream, ToSocketAddrs};
use std::path::{Path, PathBuf};
use std::thread::sleep;
use std::time::Duration;

const HYDRA_POLLING_INTERVAL: u64 = 300;
const POLLING_INTERVAL: u64 = 1;

const USAGE: &str = "
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

#[tokio::main]
async fn get_hydra_revision() -> anyhow::Result<serde_json::Value> {
    println!("Checking latest hydra revision");
    let channel_file = fs::read_to_string("/root/.nix-channels")?;

    let channel_name = channel_file
        .split('/')
        .nth(6)
        .context("invalid hydra url format")?;
    let eval_url = format!(
        "https://hydra.holo.host/jobset/holo-nixpkgs/{}/latest-eval",
        channel_name
    );

    let res = reqwest::Client::new()
        .get(&eval_url)
        .header(header::ACCEPT, "application/json")
        .header(header::CONTENT_TYPE, "application/json")
        .send()
        .await?;

    let json = res.json().await?;
    Ok(json)
}

fn main() -> Result<()> {
    println!("Initialising led manager");
    let args: Args = Docopt::new(USAGE)?
        .argv(env::args())
        .deserialize()
        .unwrap_or_else(|e| e.exit());

    let mut led = Led::open(&args.flag_device).map_err(|e| e.compat())?;

    let mut state_prev: State = Default::default();
    let state_path = args.flag_state;
    let state_temp_path = state_path.with_extension("tmp");

    let mut counter: u64 = 240; // Give it a minute on boot due to DNS error: device is busy
    let mut revision_json;
    let mut hydra_revision = "none";
    println!("Initialisation complete. Starting loop");
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

        if counter % HYDRA_POLLING_INTERVAL == 0 {  
            revision_json = get_hydra_revision()?;
            hydra_revision = revision_json["jobsetevalinputs"]["holo-nixpkgs"]["revision"]
                .as_str()
                .context("revision is not a string")?;
            counter = 0;
        }
        counter += 1;

        let local_revision = fs::read_to_string("/root/.nix-revision")
            .expect("Something went wrong reading nix-revision");
        let update_required = local_revision != hydra_revision; // If this lights up then it's likely the updater isn't working properly

        let mut tls_certificate_valid = false;
        let tls_certificate_found = Path::new("/var/lib/acme/default/account_reg.json").exists();
        if tls_certificate_found {
            let tls_certificate_raw = fs::read_to_string("/var/lib/acme/default/account_reg.json")
            .expect("Something went wrong reading certificate");
            let tls_certificate: Value = serde_json::from_str(&tls_certificate_raw)?;
            tls_certificate_valid = tls_certificate["body"]["status"] == "valid"; // Note that the TLS_certificate returns a borrow (&value)
        } 

        let system_error = false; // true if any of the following services are in a failed state: holochain-conductor.service, hp-admin-crypto-server.service, hpos-admin.service, nginx.service, zerotierone.service. Important: FAILED only not missing. holochain-conductor might not be on Nano at first.
        let hosting_error = false; // true if the following services are in a failed state: holo-auth-client.service, hpos-init.service

        let state = match (
            system_error,
            hosting_error,
            !online,
            update_required,
            !hpos_config_found,
            !tls_certificate_valid,
        ) {
            (true, _, _, _, _, _) => State::Flash(Color::Red),
            (false, true, _, _, _, _) => State::Flash(Color::Yellow),
            (false, false, true, _, _, _) => State::Flash(Color::Purple),
            (false, false, false, true, _, _) => State::Static(Color::Blue),
            (false, false, false, false, true, _) => State::Flash(Color::Green),
            (false, false, false, false, false, true) => State::Static(Color::Green),
            _ => State::Aurora,
        };

        if state != state_prev {
            led.set(state).map_err(|e| e.compat())?;
            state_prev = state;
        }
        
        fs::write(&state_temp_path, serde_json::to_vec(&state)?)?;
        fs::rename(&state_temp_path, &state_path)?;

        sleep(Duration::new(POLLING_INTERVAL, 0));
    }
}
