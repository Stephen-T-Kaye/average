const randomValueGenerator = require('./randomValueGenerator');

describe('randomValueGenerator', () => {
  describe('create', () => {
    test('returns object with interval', () => {
      let objectUnderTest = randomValueGenerator.create(100);
      expect(objectUnderTest).toMatchObject({
        getInterval: expect.any(Function),
      });
      expect(objectUnderTest.getInterval()).toBe(100);

      objectUnderTest = randomValueGenerator.create(200);
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
  });
});
