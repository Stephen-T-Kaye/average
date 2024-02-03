const Server = require('./server.js');

/* istanbul ignore next */
process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

module.exports = (async () => (Server.launch(3000)))();
