'use strict';

const Glue = require('glue');

const manifest = {
  server: {
    port: 8000,
  },
  register: {
    plugins: [
      require('./plugins/films/films.plugin.js')
    ],
    options: {
      once: true
    }
  }
};

const options = {
  relativeTo: __dirname,
};

const startServer = async () => {
  try {
    const server = await Glue.compose(manifest, options);
    await server.start();
    console.log('hapi days!');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = { startServer };
