const Server = require('../server.js');
const axios = require('axios');
const axiosTestHelper = require('../axios.test.helper.js');

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
  describe('route /average', () => {
    afterEach(() => {
      axios.get.mockRestore();
    });

    test('returns 200', async () => {
      const request = await server.inject({
        method: 'GET',
        url: '/random-value/average',
      });
      expect(request.statusCode).toBe(200);
    });

    test('returns object with average', async () => {
      // Mock return values from external API
      let mock = axiosTestHelper.csrng(axios);
      mock = [1, 15, 16, 38, 76, 22].reduce((accumulator, randomValue) =>
        accumulator.mockSuccessfulResponseOnce(randomValue),
      mock,
      );

      // Mock recoverable response so service doesn't fail after receiving
      // mocked values
      mock.mockUnsuccessfulResponse(5);

      await new Promise((r) => setTimeout(r, 8000));
      const request = await server.inject({
        method: 'GET',
        url: '/random-value/average',
      });
      expect(request.statusCode).toBe(200);
      expect(request.result).toMatchObject({
        average: 28,
      });
    }, 10000);
  });
});
