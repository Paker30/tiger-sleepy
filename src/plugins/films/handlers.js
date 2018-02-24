'use strict';
const { basePath } = require('../../config/index');
const { ReadDir, StartVideo, StopVideo, CheckDir } = require('./helper');
const Boom = require('boom');
const { assign } = require('lodash');
const Config = require('../../config/index');
const FilterHideFiles = (file) => file.match(/^[^.].*/);  //No tengo que dejar pasar nada que empiece por .

const Play = {
  execute(path, video) {
    return StartVideo(`${path}`)
      .then(({ stdout, stderr }) => `${video} reproduciendo`)
      .catch(({ stdout, stderr }) => {
        return Boom.conflict(stderr);
      });
  },
  label: 'play',
};

const Stop = {
  execute(video) {
    return StopVideo(video)
      .then(({ stdout, stderr }) => `${video} parado`)
      .catch(({ stdout, stderr }) => {
        return Boom.conflict(stderr);
      });
  },
  label: 'stop',
};

const Actions = [Play, Stop];

const GetFilms = (request, reply) => {
  const path = request.params.dirPath ? `${Config.basePath}/${request.params.dirPath}` : Config.basePath;
  return ReadDir(path)
    .then((files) => files.filter(FilterHideFiles))
    .then((files) => files.map((file) => ({ 'original': file, 'pretty': file })))
    .then((files) => files.map((file) => assign(file, { isDirectory: CheckDir(`${path}/${file.original}`) })))
    .catch((err) => {
      throw new Error('Error al recuperar los ficheros');
    });
};

const LaunchAction = (request, reply) => {

  const acction = Actions.filter(({ label }) => label === request.params.action);
  return acction[0].execute(`${basePath}${request.payload.path}`, request.params.video);
};

module.exports = { GetFilms, LaunchAction };
