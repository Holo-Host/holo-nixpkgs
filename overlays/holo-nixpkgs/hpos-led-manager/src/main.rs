use aorura::*;
use docopt::Docopt;
use failure::*;
use serde::*;

use std::env;
use std::fmt;
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
    println!("Start LED Manager");
    let args: Args = Docopt::new(USAGE)?
        .argv(env::args())
        .deserialize()
        .unwrap_or_else(|e| e.exit());

    println!("Opening LED");
    let mut led = Led::open(&args.flag_device)?;

    println!("Setting state");
    let mut state_prev: State = Default::default();
    let state_path = args.flag_state;
    let state_temp_path = state_path.with_extension("tmp");

    loop {
        println!("Starting loop");
        let router_gateway_addrs = "router-gateway.holo.host:80".to_socket_addrs();
        let online = match router_gateway_addrs {
            Ok(mut addrs) => match addrs.next() {
                Some(addr) => TcpStream::connect_timeout(&addr, Duration::new(1, 0)).is_ok(),
                None => false,
            },
            Err(_) => false,
        };
        println!("Checking config");
        let hpos_config_found = Path::new("/run/hpos-init/hpos-config.json").exists();
        println!("Match table");
        let state = match (online, hpos_config_found) {
            (false, _) => State::Flash(Color::Purple),
            (true, false) => State::Static(Color::Blue),
            _ => State::Aurora,
        };
        println!("Before led.set");
        if state != state_prev {
            led.set(state)?;
            state_prev = state;
        }
        println!("After led.set");
        fs::write(&state_temp_path, serde_json::to_vec(&state)?)?;
        fs::rename(&state_temp_path, &state_path)?;

        sleep(Duration::new(POLLING_INTERVAL, 0));
    }
}
