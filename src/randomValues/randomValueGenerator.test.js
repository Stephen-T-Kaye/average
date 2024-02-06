const randomValueGenerator = require('./randomValueGenerator');

const axios = require('axios');

afterEach(() => {
  axios.get.mockRestore();
});

describe('randomValueGenerator', () => {
  describe('create', () => {
    test('returns object with interval', () => {
      let objectUnderTest = randomValueGenerator.create(100, () => {});
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
        randomValueGenerator.create(interval);
      };

      [1.5, '1', '', ' ', 'string', {}, null].forEach((interval) => {
        expect(intervalTest(interval)).toThrow();
      });
    });

    test('when called with invalid onValueGenerated errors', () => {
      const onValueGeneratedTest = (onValueGenerated) => () => {
        randomValueGenerator.create(1000, onValueGenerated);
      };

      [1, '', ' ', 'string', {}, null].forEach((onValueGenerated) => {
        expect(onValueGeneratedTest(onValueGenerated)).toThrow();
      });
    });

    test('when called with invalid onError errors', () => {
      const onErrorTest = (onError) => () => {
        randomValueGenerator.create(1000, () => {}, onError);
      };

      [1, '', ' ', 'string', {}].forEach((onError) => {
        expect(onErrorTest(onError)).toThrow();
      });
    });
  });

  describe('api calls', () => {
    test('generator polls api', async () => {
      const axiosMock = axios.get.mockImplementation(() =>
        Promise.resolve({
          data: [{status: 'success', min: 0, max: 100, random: 54}],
        }),
      );
      let randomValue;
      randomValueGenerator.create(100, (random) => {
        randomValue = random;
      });
      await new Promise((r) => setTimeout(r, 1000));
      expect(axiosMock).toHaveBeenCalled();
      expect(randomValue).toBe(54);
      expect(axiosMock.mock.calls.length).toBeGreaterThan(1);
    });

    // eslint-disable-next-line max-len
    test('raises exception and stops polling when an unrecoverable response is returned', async () => {
      const axiosMock = axios.get.mockImplementation(() =>
        Promise.resolve({
          data: [
            {
              status: 'error',
              code: '4',
            },
          ],
        }),
      );
      let errorRaised = false;
      let pollCount = 0;
      randomValueGenerator.create(
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
      const axiosMock = axios.get.mockImplementation(() =>
        Promise.reject(new Error('Bad Request')),
      );

      let errorRaised = false;
      let pollCount = 0;
      randomValueGenerator.create(
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
      const axiosMock = axios.get.mockImplementation(() =>
        Promise.resolve({
          data: [
            {
              status: 'error',
              code: '5',
            },
          ],
        }),
      );
      randomValueGenerator.create(100, () => {});
      await new Promise((r) => setTimeout(r, 1000));
      expect(axiosMock).toHaveBeenCalled();
      expect(axiosMock.mock.calls.length).toBeGreaterThan(1);
    });
  });
});
