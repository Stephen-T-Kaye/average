/**
 * hapi Plugin.
 * @module randomValues
 */

const Joi = require('joi');
const averageCalculator = require('./averageCalculator');
const randomValueGenerator = require('./randomValueGenerator');

/**
 * Returns a hapi plugin that can be registered with a hapi server.
 */
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
        tags: ['api'],
        description: 'Returns average of random values',
        bind: {averageCalculator: ac},
        handler: function(request, h) {
          return {average: h.context.averageCalculator.getAverage()};
        },
        response: {
          sample: 0,
          status: {
            200: Joi.object({
              average: Joi.number().required(),
            }).label('average-response'),
          },
        },
      },
    });
  },
};
