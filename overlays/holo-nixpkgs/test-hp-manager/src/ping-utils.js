const exec = require('child_process').exec

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

module.exports.getAllPingResults = async (holoports, command) => {
  // Convert array of holoports into array of promises each resolving to ping-result-object
  if(command === 'pingCheck') return await Promise.all(holoports.map((hp) => pingCheck(hp)))
  if(command === 'switchChannel') return await Promise.all(holoports.map((hp) => switchChannel(hp)))
  if(command === 'rebootHoloports') return await Promise.all(holoports.map((hp) => rebootHoloports(hp)))
}

const pingCheck = async (holoport) => {
  if (!argv.sshKeyPath)
    throw new Error('test-holoports-monitor requires --ssh-key-path option.')
  const command = `ssh root@${holoport.IP} -o StrictHostKeyChecking=no -i ${argv.sshKeyPath} nixos-option system.holoNetwork | sed -n '2 p' | tr -d \\"`
  
  return new Promise(function(resolve, reject) {
    exec(command, { timeout: 4000 }, (error, stdout, stderr) => {
      let outcome = null
      if (!error) outcome = stdout.trim()

      resolve({
        name: holoport.name,
        IP: holoport.IP,
        timestamp: Date.now(),
        success: (outcome != null),
        holoNet: outcome
      });
    });
  });
}

const switchChannel = async (holoport) => {
  if (!argv.sshKeyPath)
    throw new Error('test-holoports-monitor requires --ssh-key-path option.')

    if (!argv.targetChannel)
    throw new Error('test-holoports-monitor requires --target-channel option.')

  const command = `ssh root@${holoport.IP} -i ${argv.sshKeyPath} hpos-update ${argv.targetChannel}`

  return new Promise(function(resolve, reject) {
    exec(command, { timeout: 4000 }, (error, stdout, stderr) => {
      resolve({
        name: holoport.name,
        IP: holoport.IP,
        timestamp: Date.now(),
        success: stdout.trim() === `Switching HoloPort to channel: ${argv.targetChannel}`,
      });
    });
  });
}

// this will always error?
const rebootHoloports = async (holoport) => {
  if (!argv.sshKeyPath)
    throw new Error('test-holoports-monitor requires --ssh-key-path option.')

  const command = `ssh root@${holoport.IP} -i ${argv.sshKeyPath} "rm -rf /var/lib/holochain-rsm && rm -rf /var/lib/configure-holochain && reboot"`

  return new Promise(function(resolve, reject) {
    exec(command, { timeout: 4000 }, (error, stdout, stderr) => {     
      resolve({
        name: holoport.name,
        IP: holoport.IP,
        timestamp: Date.now(),
        success: stderr.trim() === `Connection to ${holoport.IP} closed by remote host.`,
      });
    });
  });
}

