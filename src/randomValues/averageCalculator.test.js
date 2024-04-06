const averageCalculator = require('./averageCalculator.js');

describe('averageCalculator', () => {
  test('returns an object with 2 functions', async () => {
    const ac = averageCalculator.create();

    expect(ac).toMatchObject({
      addValue: expect.any(Function),
      getAverage: expect.any(Function),
    });
  });

  describe('addValue', () => {
    ['', ' ', 'string', {}, null].forEach((testArgument) => {
      test(`called with '${testArgument}' throws`, () => {
        const ac = averageCalculator.create();
        expect(() => ac.addValue(testArgument)).toThrow();
      });
    });

    test('called with numeric value does not throw', async () => {
      const ac = averageCalculator.create();
      expect(() => ac.addValue(10)).not.toThrow();
    });
  });

  describe('getAverage', () => {
    test('returns 0 if no values have been added', async () => {
      const ac = averageCalculator.create();
      expect(ac.getAverage()).toBe(0);
    });

    [
      {values: [], average: 0},
      {values: [1, 10, 8], average: 6.333333333333333},
      {values: [13, 27, 83], average: 41},
      {values: [13, 27, 83, 10, 27, 16, 79], average: 36.42857142857143},
    ].forEach((testArgument) => {
      test(`calculates the average of ${JSON.stringify(
          testArgument.values,
      )} as ${testArgument.average}`, () => {
        const ac = averageCalculator.create();
        testArgument.values.forEach((newValue) => ac.addValue(newValue));
        expect(ac.getAverage()).toBe(testArgument.average);
      });
    });
  });

  describe('getFrequency', () => {
    [
      {values: [], number: 0, expectedResult: 0},
      {values: [], number: 7, expectedResult: 0},
      {values: [1, 1, 3, 6], number: 0, expectedResult: 0},
      {values: [1, 1, 3, 6], number: 1, expectedResult: 2},
      {values: [1, 1, 3, 6], number: 3, expectedResult: 1},
      {values: [1, 1, 3, 6], number: 6, expectedResult: 1},
    ].forEach((testArgument) => {
      test(`Returns frequency of ${
        testArgument.number
      } from the values ${JSON.stringify(testArgument.values)} as ${
        testArgument.expectedResult
      }`, () => {
        const ac = averageCalculator.create();
        testArgument.values.forEach((newValue) => ac.addValue(newValue));
        expect(ac.getFrequency(testArgument.number)).toBe(
            testArgument.expectedResult,
        );
      });
    });
  });
});
