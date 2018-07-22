'use strict';

const Joi = require('joi');
const { readFilmsInDir, LaunchAction } = require('./handlers');
const { either } = require('sanctuary');

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
      handler: (request, h) => new Promise((resolve, reject) => {
        either
          (() => reject(new Error('Error al recuperar los ficheros')))
          (films => resolve(films))
          (readFilmsInDir(request.params.dirPath));
      })
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
