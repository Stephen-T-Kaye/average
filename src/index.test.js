const Hapi = require('@hapi/hapi');

const index = require('./index.js');
const axios = require('axios');

const axiosTestHelper = require('./axios.test.helper.js');

let server;

beforeAll(() => {
  axiosTestHelper.csrng(axios).mockSuccessfulResponse(54);
});

afterAll(async () => {
  await server.stop();
});

describe('index.js', () => {
  test('Creates Hapi server', async () => {
    server = await index;

    const expectedConstructor = Hapi.server().constructor;

    expect(server.constructor).toBe(expectedConstructor);
  });
});
