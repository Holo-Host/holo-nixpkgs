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
    let local_revision = fs::read_to_string("/root/.nix-revision")
                            .expect("Something went wrong reading nix-revision");
                            
    println!("local revision: {}", local_revision);
 }