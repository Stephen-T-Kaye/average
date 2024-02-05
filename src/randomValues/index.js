const averageCalculator = require('../averageCalculator')();

exports.plugin = {
  name: 'randomValues',
  version: '1.0.0',
  register: async function(server, options) {
    server.route({
      method: 'GET',
      path: '/random-value/average',
      config: {
        description: 'Returns average of random values',
        bind: {averageCalculator},
        handler: function(request, h) {
          return {average: h.context.averageCalculator.getAverage()};
        },
      },
    });
  },
};
