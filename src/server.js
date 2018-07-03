'use strict';

const Glue = require('glue');

const startServer = async (manifest, options) => {
  try {
    const server = await Glue.compose(manifest, options);
    await server.start();
    console.log('hapi days!');
    return server;
  } catch (err) {
    console.error(err);
    // process.exit(1);
  }
};

module.exports = { startServer };
