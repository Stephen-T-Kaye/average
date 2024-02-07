const randomValueGenerator = require('./randomValueGenerator');
const axiosTestHelper = require('../axios.test.helper.js');

const axios = require('axios');
let objectUnderTest;
const networkError = new Error();
networkError.code = 'ECONNABORTED';

afterEach(() => {
  if (objectUnderTest) {
    objectUnderTest.stop();
  }
  axios.get.mockRestore();
});

describe('randomValueGenerator', () => {
  describe('create', () => {
    test('returns object with interval', () => {
      objectUnderTest = randomValueGenerator.create(100, () => {});
      expect(objectUnderTest).toMatchObject({
        getInterval: expect.any(Function),
      });
      expect(objectUnderTest.getInterval()).toBe(100);

      objectUnderTest = randomValueGenerator.create(200, () => {});
      expect(objectUnderTest).toMatchObject({
        getInterval: expect.any(Function),
      });
      expect(objectUnderTest.getInterval()).toBe(200);
    });

    test('when called with invalid interval errors', () => {
      const intervalTest = (interval) => () => {
        objectUnderTest = randomValueGenerator.create(interval);
      };

      [1.5, '1', '', ' ', 'string', {}, null].forEach((interval) => {
        expect(intervalTest(interval)).toThrow();
      });
    });

    test('when called with invalid onValueGenerated errors', () => {
      const onValueGeneratedTest = (onValueGenerated) => () => {
        objectUnderTest = randomValueGenerator.create(1000, onValueGenerated);
      };

      [1, '', ' ', 'string', {}, null].forEach((onValueGenerated) => {
        expect(onValueGeneratedTest(onValueGenerated)).toThrow();
      });
    });

    test('when called with invalid onError errors', () => {
      const onErrorTest = (onError) => () => {
        objectUnderTest = randomValueGenerator.create(1000, () => {}, onError);
      };

      [1, '', ' ', 'string', {}].forEach((onError) => {
        expect(onErrorTest(onError)).toThrow();
      });
    });
  });

  describe('stop', () => {
    test('stops the generator from generating new values', async () => {
      axiosTestHelper.csrng(axios).mockSuccessfulResponse(54);

      let pollCount = 0;
      objectUnderTest = randomValueGenerator.create(200, () => {
        pollCount++;
        objectUnderTest.stop();
      });
      await new Promise((r) => setTimeout(r, 1000));
      expect(pollCount).toBe(1);
    });
  });

  describe('api calls', () => {
    test('generator polls api', async () => {
      const axiosMock = axiosTestHelper
          .csrng(axios)
          .mockSuccessfulResponse(54)
          .mock();
      let randomValue;
      objectUnderTest = randomValueGenerator.create(100, (random) => {
        randomValue = random;
      });
      await new Promise((r) => setTimeout(r, 1000));
      expect(axiosMock).toHaveBeenCalled();
      expect(randomValue).toBe(54);
      expect(axiosMock.mock.calls.length).toBeGreaterThan(1);
    });

    // eslint-disable-next-line max-len
    test('raises exception and stops polling when an unrecoverable response is returned', async () => {
      const axiosMock = axiosTestHelper
          .csrng(axios)
          .mockUnsuccessfulResponse(4)
          .mock();
      let errorRaised = false;
      let pollCount = 0;
      objectUnderTest = randomValueGenerator.create(
          100,
          () => {
            pollCount++;
          },
          () => {
            pollCount++;
            errorRaised = true;
          },
      );
      await new Promise((r) => setTimeout(r, 1000));
      expect(axiosMock).toHaveBeenCalled();
      expect(errorRaised).toBe(true);
      expect(pollCount).toBe(1);
    });

    // eslint-disable-next-line max-len
    test('raises exception and stops polling if http request fails', async () => {
      const axiosMock = axiosTestHelper
          .csrng(axios)
          .mockError(new Error('Bad Request'))
          .mock();

      let errorRaised = false;
      let pollCount = 0;
      objectUnderTest = randomValueGenerator.create(
          100,
          () => {
            pollCount++;
          },
          () => {
            pollCount++;
            errorRaised = true;
          },
      );
      await new Promise((r) => setTimeout(r, 1000));
      expect(axiosMock).toHaveBeenCalled();
      expect(errorRaised).toBe(true);
      expect(pollCount).toBe(1);
    });

    test('retries request if recoverable', async () => {
      const axiosMock = axiosTestHelper
          .csrng(axios)
          .mockUnsuccessfulResponse(5)
          .mock();
      objectUnderTest = randomValueGenerator.create(100, () => {});
      await new Promise((r) => setTimeout(r, 1000));
      expect(axiosMock).toHaveBeenCalled();
      expect(axiosMock.mock.calls.length).toBeGreaterThan(1);
    });

    test('retries request if connection fails', async () => {
      const axiosMock = axiosTestHelper
          .csrng(axios)
          .mockNetworkError()
          .mock();

      objectUnderTest = randomValueGenerator.create(100, () => {});
      await new Promise((r) => setTimeout(r, 1000));
      expect(axiosMock).toHaveBeenCalled();
      expect(axiosMock.mock.calls.length).toBeGreaterThan(1);
    });

    test('doesn\'t retry request if connection fails but state is stopped',
        async () => {
          const axiosMock = axiosTestHelper
              .csrng(axios)
              .mockNetworkError()
              .mock();

          objectUnderTest = randomValueGenerator.create(100, () => {});
          objectUnderTest.stop();
          await new Promise((r) => setTimeout(r, 1000));
          expect(axiosMock).toHaveBeenCalled();
          expect(axiosMock.mock.calls.length).toBe(1);
        });
  });
});
