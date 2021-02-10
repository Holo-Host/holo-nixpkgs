const { app } = require('../src/index');
const request = require('supertest');
const { AdminWebsocket } = require('@holochain/conductor-api');

test('Test holochain-api endpoint ', async () => {
    let listOfHapps = await request(app).get('/hosted_happs').send();
    expect(listOfHapps.status).toBe(200);
    expect(listOfHapps.body[0].enabled).toBe(false);
    expect(listOfHapps.body[0].source_chain).toBe(0)
    preferences = {
          "max_fuel_before_invoice": 1,
          "max_time_before_invoice": [80000, 0],
          "price_compute": 1,
          "price_storage": 2,
          "price_bandwidth": 1,
      }
    let res = await request(app)
            .post('/install_hosted_happ')
            .send({ happ_id: listOfHapps.body[0].id, preferences });
    expect(res.status).toBe(200);
    let listOfHappsReload = await request(app).get('/hosted_happs').send();
    expect(listOfHappsReload.status).toBe(200);
    expect(listOfHappsReload.body[0].enabled).toBe(true);
    expect(listOfHappsReload.body[0].source_chain).toBe(0)
}, 30000);
