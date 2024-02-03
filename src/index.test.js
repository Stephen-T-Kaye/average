const Hapi = require('@hapi/hapi');

const index = require('./index.js');

afterAll(async () => {
  const server = await index;
  await server.stop();
});

describe('index.js', () => {
  test('Creates Hapi server', async () => {
    const server = await index;

    const expectedConstructor = Hapi.server().constructor;

    expect(server.constructor).toBe(expectedConstructor);
  });
});
