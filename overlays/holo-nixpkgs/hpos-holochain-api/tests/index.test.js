const { app } = require('../src/index')
const request = require('supertest')

const HAPP_NAME = 'Elemental Chat'
const USAGE_DURATION_INTERVAL = 'WEEK'
const usageTimeInterval = {
  duration_unit: USAGE_DURATION_INTERVAL,
  amount: 1
}

function delay(t, val) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(val)
    }, t)
  })
}

test('holochain-api endpoint ', async () => {
  const shouldBe400 = await request(app).get('/hosted_happs').send('badjson')
  expect(shouldBe400.status).toBe(400)

  const listOfHappsResponse = await request(app).get('/hosted_happs').send(usageTimeInterval)
  expect(listOfHappsResponse.status).toBe(200)
  const listOfHapps = JSON.parse(listOfHappsResponse.text)
  expect(listOfHapps[0].name).toBe(HAPP_NAME)
  expect(listOfHapps[0].enabled).toBe(false)
  expect(listOfHapps[0].error.message).toBeTruthy()
  expect(listOfHapps[0].error.source).toBeTruthy()
  expect(listOfHapps[0].sourceChains).toBeFalsy()
  expect(listOfHapps[0].usage).toBeFalsy()

  const preferences = {
    "max_fuel_before_invoice": 1,
    "max_time_before_invoice": [80000, 0],
    "price_compute": 1,
    "price_storage": 2,
    "price_bandwidth": 1
  }

  const res = await request(app)
    .post('/install_hosted_happ')
    .send({ happ_id: listOfHapps[0].id, preferences })
  expect(res.status).toBe(200)

  await delay(10000)

  const listOfHappsReloadResponse = await request(app).get('/hosted_happs').send(usageTimeInterval)
  const usage = {
    bandwidth: 0,
    cpu: 0
  }
  expect(listOfHappsReloadResponse.status).toBe(200)
  const listOfHappsReload = JSON.parse(listOfHappsReloadResponse.text)
  expect(listOfHappsReload[0].enabled).toBe(true)
  expect(listOfHappsReload[0].name).toBe(HAPP_NAME)
  expect(listOfHappsReload[0].sourceChains).toBe(0)
  expect(listOfHappsReload[0].storage).toBe(0)
  expect(listOfHappsReload[0].usage).toStrictEqual(usage)
}, 50000)

test('dashboard endpoint', async () => {
  const usageTimeInterval = {
    duration_unit: 'DAY',
    amount: 1
  }

  const dashboardResponse = await request(app).get('/dashboard').send(usageTimeInterval)
  expect(dashboardResponse.status).toBe(200)
  expect(dashboardResponse.body.totalSourceChains).toBe(0)
  expect(dashboardResponse.body.currentTotalStorage).toBe(0)
  expect(dashboardResponse.body.usage.cpu).toBe(0)
  expect(dashboardResponse.body.usage.bandwidth).toBe(0)
}, 50000)
