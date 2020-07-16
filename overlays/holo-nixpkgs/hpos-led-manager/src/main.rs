use aorura::*;
use docopt::Docopt;
use failure::*;
use serde::*;
use serde_json::{Result, Value};
use reqwest::Error;

use std::env;
use std::fs;
use std::net::{TcpStream, ToSocketAddrs};
use std::path::{Path, PathBuf};
use std::thread::sleep;
use std::time::Duration;

const POLLING_INTERVAL: u64 = 1;
const HYDRA_POLLING_INTERVAL: u64 = 300;
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

// Check the hydra revision of holo-nixpkgs. Used to compare with local revision to see if not updated.
#[tokio::get_hydra_revision] 
async fn get_hydra_revision(http_client) { 
    let channel = fs::read_to_string("/root/.nix-channel") 
    .expect("Something went wrong reading .nix-channel");
    let channel_name = channel.split('/').nth(6)                        
    let eval_url = "https://hydra.holo.host/jobset/holo-nixpkgs/" + channel_name + "/latest-eval"

    http_client
    .get(eval_url)
    .header(header::ACCEPT, "application/json")
    .header(header::CONTENT_TYPE, "application/json")
    .send()
    .await?
    .json()?;
}

fn request_error_handler(e: reqwest::Error) {
    if e.is_http() {
        match e.url() {
            None => println!("No Url given"),
            Some(url) => println!("Problem making request to: {}", url),
        }
    }
    // Inspect the internal error and output it
    if e.is_serialization() {
       let serde_error = match e.get_ref() {
            None => return,
            Some(err) => err,
        };
        println!("problem parsing information {}", serde_error);
    }
    if e.is_redirect() {
        println!("server redirecting too many times or making loop");
    }
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
    let client = reqwest::Client::new();

    let mut counter: u64 = 0;
    let mut hydra_revision = "none";

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
        
        // Run get_hydra_revision once every 5 minutes if running it in the loop is too taxing?
        if counter % 5000 == 1 {
            match get_hydra_revision() {
                Err(e) => request_error_handler(e),
                Ok(res)  => hydra_revision = res["jobsetevalinputs"]["holo-nixpkgs"]["revision"],
            };
            counter += 1;
        }
               
        let local_revision = fs::read_to_string("/root/.nix-revision")
                            .expect("Something went wrong reading nix-revision");
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
        };

        fs::write(&state_temp_path, serde_json::to_vec(&state)?)?;
        fs::rename(&state_temp_path, &state_path)?;

        sleep(Duration::new(POLLING_INTERVAL, 0));
    }
}
