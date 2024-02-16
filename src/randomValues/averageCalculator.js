const createAverageCalculator = function createAverageCalculator() {
  let currentAverage = 0;
  let sampleSize = 0;
  const frequencies = {};
  return {
    addValue: function addValue(newValue) {
      if (typeof newValue !== 'number') {
        throw new Error('not a number');
      }

      sampleSize += 1;
      currentAverage =
        currentAverage + (newValue - currentAverage) / sampleSize;
      if (!frequencies.hasOwnProperty(newValue)) {
        frequencies[newValue] = 0;
      }
      frequencies[newValue]++;
    },
    getAverage: function getAverage() {
      return currentAverage;
    },
    getFrequency: function getFrequency(num) {
      return frequencies[num] || 0;
    },
  };
};

module.exports = {
  create: createAverageCalculator,
};
