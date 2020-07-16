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

fn main() -> Fallible<()> {
    let TLS_certificate: Value = serde_json::from_reader("/var/lib/acme/default/account_reg.json")?; 
    let TLS_certificate_valid = TLS_certificate["body"]["status"] == "valid" // Note that the TLS_certificate returns a borrow (&value)

    println!("TLS cert valid: {}", TLS_certificate_valid);
 }