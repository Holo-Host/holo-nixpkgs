const { HAPP_PORT, getAppIds } = require('./const')
const { AppWebsocket} = require('@holochain/conductor-api')
const { callZome } = require('./api')

const DEFAULT_UI = 'https://github.com/zo-el/holo-404/releases/download/v0.0.1/holo-404.zip';

const registerECHapp = async (bundle_url, ui_src_url) => {
  const appWs = await AppWebsocket.connect(`ws://localhost:${HAPP_PORT}`)
  const APP_ID = await getAppIds()
  const ecHappBundle = {
    hosted_url: "https://elemental-chat.holo.host",
    bundle_url,
    happ_alias: "chat",
    ui_src_url: ui_src_url ? ui_src_url : DEFAULT_UI,
    name: "Elemental Chat",
    dnas: [{
      hash: "fake-hash",
      src_url: "fake-path",
      nick: "elemental-chat",
    }]
  }
  let happ =  await callZome(appWs, APP_ID.HHA, 'hha', 'register_happ', ecHappBundle)
  return happ
}

module.exports = {
  registerECHapp
}
