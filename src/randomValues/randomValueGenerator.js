const createRandomValueGenerator = function createRandomValueGenerator(
    interval,
    onValueGenerated,
) {
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
