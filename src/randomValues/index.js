const averageCalculator = require('./averageCalculator');
const randomValueGenerator = require('./randomValueGenerator');

exports.plugin = {
  name: 'randomValues',
  version: '1.0.0',
  register: async function(server, options) {
    const ac = averageCalculator.create();
    const rvg = randomValueGenerator.create(1000, (randomValue) => {
      server.log(`adding random value ${randomValue}`);
      ac.addValue(randomValue);
    });

    server.events.on('closing', () => {
      rvg.stop();
    });

    server.route({
      method: 'GET',
      path: '/random-value/average',
      config: {
        description: 'Returns average of random values',
        bind: {averageCalculator: ac},
        handler: function(request, h) {
          return {average: h.context.averageCalculator.getAverage()};
        },
      },
    });
  },
};
