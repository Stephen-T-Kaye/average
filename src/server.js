const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('../package');
const randomValues = require('./randomValues');

/**
 * An Average Service Server.
 * @module server
 */

/**
 * Creates a Hapi Server listening on the given port, starts it and returns
 * a reference to the server.
 * @param {int} port The port number for the Hapi Server to listen on.
 * @return {Hapi.Server} A Hapi Server
 */
exports.launch = async (port) => {
  const server = Hapi.server({
    port,
    host: 'localhost',
  });

  const swaggerOptions = {
    info: {
      title: 'Average service API Documentation',
      version: Pack.version,
    },
    documentationPath: '/',
  };

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
    {
      plugin: require('hapi-pino'),
      options: {
        // Redact Authorization headers, see https://getpino.io/#/docs/redaction
        // The brief stipulates no auth but this is usually a sensible default
        redact: ['req.headers.authorization'],
      },
    },
    {
      plugin: randomValues,
    },
  ]);

  await server.start();
  // eslint-disable-next-line no-console
  console.log(`Server running at: ${server.info.uri}`);

  return server;
};
