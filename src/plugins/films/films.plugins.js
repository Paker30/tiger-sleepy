'use strict';

const Joi = require('joi');
const { GetFilms, LaunchAction } = require('./handlers');

const films = {
  name: 'films',
  version: '1.0.0',
  register: (server, options) => {
    server.route({
      method: 'GET',
      config: {
        cors: true,
      },
      path: '/video/{dirPath*}',
      handler: GetFilms
    });
    server.route({
      method: 'POST',
      path: '/action/{action}/video/{video*}',
      config: {
        cors: true,
        validate:
          {
            params: {
              action: Joi.string().lowercase().valid(['play', 'stop', 'forward', 'rewind']),
              video: Joi.string()
            }
          }
      },
      handler: LaunchAction
    });
  }
};

module.exports = films;
