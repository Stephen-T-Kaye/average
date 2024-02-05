const createRandomValueGenerator = function createRandomValueGenerator(
    interval,
    onValueGenerated,
) {
  if (!Number.isInteger(interval)) {
    throw new Error('Invalid interval');
  }
  if (typeof onValueGenerated !== 'function') {
    throw new Error('Invalid onValueGenerated');
  }
  setInterval(() => {
    onValueGenerated(0);
  }, interval);
  return {
    getInterval: () => interval,
  };
};

module.exports = {
  create: createRandomValueGenerator,
};
