'use strict';

const server = require('../src/server');

const manifest = {
  server: {
    port: 8000,
  },
  register: {
    plugins: [
      require('./plugins/films/films.plugins')
    ],
    options: {
      once: true
    }
  }
};

const options = {
  relativeTo: __dirname,
};

server.startServer(manifest, options);
