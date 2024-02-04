const averageCalculator = function createAverageCalculator() {
  let currentAverage = 0;
  let sampleSize = 0;
  return {
    addValue: function addValue(newValue) {
      if (typeof newValue !== 'number') {
        throw new Error('not a number');
      }

      sampleSize += 1;
      currentAverage =
        currentAverage + (newValue - currentAverage) / sampleSize;
    },
    getAverage: function getAverage() {
      return currentAverage;
    },
  };
};

module.exports = averageCalculator;
