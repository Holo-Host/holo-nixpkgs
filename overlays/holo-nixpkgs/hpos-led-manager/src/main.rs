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
use std::process::Command;

const POLLING_INTERVAL: u64 = 1;

const USAGE: &'static str = "
Usage: hpos-led-manager --device <path> --state <path> --kitsune <url>
       hpos-led-manager --help

Manages AORURA LED.

Options:
  --device <path>  Path to AORURA device
  --state <path>   Path to state JSON file
  --kitsune <url>  Kitsune proxy url to check
";

#[derive(Debug, Deserialize)]
struct Args {
    flag_device: PathBuf,
    flag_state: PathBuf,
    flag_kitsune: String
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
        let conn_zerotier = match router_gateway_addrs {
            Ok(mut addrs) => match addrs.next() {
                Some(addr) => TcpStream::connect_timeout(&addr, Duration::new(1, 0)).is_ok(),
                None => false,
            },
            Err(_) => false,
        };
        
        let conn_kitsune_proxy = match Command::new("proxy-cli")
            .args(&["--", &args.flag_kitsune])
            .output()
        {   
            Ok(output) => { 
                let output_string = String::from_utf8(output.stdout)?;
                output_string.contains("tokio_task_count")
            },
            Err(_) => false,
        };

        let hpos_config_found = Path::new("/run/hpos-init/hpos-config.json").exists();

        let state = match (conn_zerotier, hpos_config_found, conn_kitsune_proxy) {
            (false, _, _) => State::Flash(Color::Purple),
            (true, false, _) => State::Static(Color::Blue),
            (true, true, false) => State::Flash(Color::Orange),
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
