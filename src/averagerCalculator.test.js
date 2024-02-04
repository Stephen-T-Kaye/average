const createAverageCalculator = require('./averageCalculator.js');

describe('averageCalculator', () => {
  test('returns an object with 2 functions', async () => {
    const averageCalculator = createAverageCalculator();

    expect(averageCalculator).toMatchObject({
      addValue: expect.any(Function),
      getAverage: expect.any(Function),
    });
  });

  describe('addValue', () => {
    ['string', {}, null].forEach((testArgument) => {
      test('called with non numeric value throws', () => {
        const averageCalculator = createAverageCalculator();
        expect(() => averageCalculator.addValue(testArgument)).toThrow();
      });
    });

    test('called with numeric value does not throw', async () => {
      const averageCalculator = createAverageCalculator();
      expect(() => averageCalculator.addValue('error')).not.toThrow();
    });
  });

  describe('getAverage', () => {
    test('returns 0 if no values have been added', async () => {
      const averageCalculator = createAverageCalculator();
      expect(averageCalculator.getAverage()).toBe(0);
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
        const averageCalculator = createAverageCalculator();
        testArgument.values.forEach((newValue) =>
          averageCalculator.addValue(newValue),
        );
        expect(averageCalculator.getAverage()).toBe(testArgument.average);
      });
    });
  });
});
