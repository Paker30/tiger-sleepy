'use strict';

const Joi = require('joi');
const { basePath } = require('./../../config');
const { readFilmsInDir, actions } = require('./handlers');
const { either, compose: B, filter } = require('sanctuary');
const { getOr } = require('lodash/fp');
const getPath = getOr('/', 'payload.path');
const head = a => a[0];
const A = f => x => f(x);

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
          (reject)
          (resolve)
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
            action: Joi.string().lowercase().valid(['play', 'stop', 'forward', 'rewind']).required(),
            video: Joi.string().required()
          }
        }
      },
      handler: (request, reply) => B
        (B((act) => act.execute(`${basePath}${getPath(request)}`, request.params.video))(head))
        (filter(({ label }) => label === request.params.action))
        (actions)
    });
  }
};

module.exports = films;
