extern crate getopts;

use std::env;
use std::fs;
use std::i64;
use std::process::exit;
use std::process::Command;
use std::thread::sleep;
use std::time::Duration;

use getopts::Options;

fn aurora_led(args: &[&str]) {
    Command::new("aurora-led").args(args).status().ok();
}

const THERMAL_ZONE: &str = "/sys/class/thermal/thermal_zone0/temp";

fn get_temp() -> i64 {
    return fs::read_to_string(THERMAL_ZONE)
        .unwrap()
        .trim()
        .parse()
        .unwrap();
}

// TODO: replace with self-hosted TCP service
fn is_online(operstate: &str) -> bool {
    return fs::read_to_string(operstate).unwrap().trim() == "up";
}

fn print_usage(program: &str, opts: Options) {
    let brief = opts.short_usage(program);
    println!("{}\n", opts.usage(&brief));
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let program = args[0].clone();

    let mut opts = Options::new();
    opts.reqopt("", "device", "path to Aurora LED controller device", "PATH");
    opts.reqopt("", "operstate", "path to Linux net operstate", "PATH");

    let matches = match opts.parse(&args[1..]) {
        Ok(m) => m,
        Err(f) => {
            println!("{}\n", f.to_string());
            print_usage(&program, opts);
            exit(1);
        }
    };

    let device = matches.opt_str("device").unwrap();
    let operstate = matches.opt_str("operstate").unwrap();

    let mut is_aurora = false;

    loop {
        sleep(Duration::new(1, 0));

        match get_temp() {
            79000...98999 => {
                aurora_led(&["--device", &device, "--mode", "flash", "--color", "yellow"]);
                is_aurora = false;
                continue;
            }
            99000...i64::MAX => {
                aurora_led(&["--device", &device, "--mode", "flash", "--color", "red"]);
                is_aurora = false;
                continue;
            }
            _ => {}
        }

        if !is_online(&operstate) {
            aurora_led(&["--device", &device, "--mode", "flash", "--color", "purple"]);
            is_aurora = false;
            continue;
        }

        if !is_aurora {
            aurora_led(&["--device", &device, "--mode", "aurora"]);
            is_aurora = true;
        }
    }
}
