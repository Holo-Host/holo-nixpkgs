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
            println!("hydra revision: {}", hydra_revision);
        }
    }

    sleep(Duration::new(POLLING_INTERVAL, 0));
 }