const Server = require('../server.js');

let server = null;

beforeAll(async () => {
  // Set port to 0 to use an ephemeral port and avoid
  // contention on ports when tests are run in parallel
  server = await Server.launch(0);
});
afterAll(async () => {
  await server.stop();
});

describe('random-value', () => {
  describe('registers route /average', () => {
    test('returns 200', async () => {
      const request = await server.inject({
        method: 'GET',
        url: '/random-value/average',
      });
      expect(request.statusCode).toBe(200);
    });

    test('returns object with average', async () => {
      const request = await server.inject({
        method: 'GET',
        url: '/random-value/average',
      });
      expect(request.statusCode).toBe(200);
      expect(request.result).toMatchObject({
        average: expect.any(Number),
      });
    });
  });
});
