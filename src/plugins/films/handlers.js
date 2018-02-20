'use strict';
const { basePath } = require('../../config/index');
const { ReadDir, StartVideo, StopVideo } = require('./helper');
const Boom = require('boom');
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

const GetFilms = (request, reply) =>
  ReadDir(request.params.dirPath ? request.params.dirPath : Config.basePath)
    .then((files) => files.filter(FilterHideFiles))
    .then((files) => files.map((file) => ({ 'original': file, 'pretty': file })))
    .catch((err) => {
      throw new Error('Error al recuperar los ficheros');
    });

const LaunchAction = (request, reply) => {

  const acction = Actions.filter(({ label }) => label === request.params.action);
  return acction[0].execute(`${basePath}${request.payload.path}`, request.params.video);
};

module.exports = { GetFilms, LaunchAction };
