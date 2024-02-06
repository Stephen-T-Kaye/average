const Hapi = require('@hapi/hapi');

const index = require('./index.js');
const axios = require('axios');

let server;

beforeAll(() => {
  axios.get.mockImplementation(() =>
    Promise.resolve({
      data: [{status: 'success', min: 0, max: 100, random: 54}],
    }),
  );
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
