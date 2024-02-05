exports.plugin = {
  name: 'randomValues',
  version: '1.0.0',
  register: async function(server, options) {
    server.route({
      method: 'GET',
      path: '/random-value/average',
      config: {
        description: 'Returns average of random values',
        handler: function(request, h) {
          throw new Error('Not implemented');
        },
      },
    });
  },
};
