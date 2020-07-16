use aorura::*;
use docopt::Docopt;
use failure::*;
use serde::*;
use reqwest::Error;

use std::env;
use std::fs;
use std::net::{TcpStream, ToSocketAddrs};
use std::path::{Path, PathBuf};
use std::thread::sleep;
use std::time::Duration;

const HYDRA_POLLING_INTERVAL: u64 = 300;
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

        let state = match (online, hpos_config_found) {
            (false, _) => State::Flash(Color::Purple),
            (true, false) => State::Static(Color::Blue),
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
