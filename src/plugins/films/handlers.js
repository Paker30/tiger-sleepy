'use strict';
const fs = require('fs');
const Boom = require('boom');
const { assign } = require('lodash');
const { toEither, pipe, map, filter, compose } = require('sanctuary');
const { basePath } = require('../../config/index');
const { startVideo, stopVideo } = require('./helper');

const { getOr } = require('lodash/fp');
const getPath = getOr('/', 'payload.path');
const FilterHideFiles = (file) => /^[^.].*/.test(file);  //No tengo que dejar pasar nada que empiece por .
const filmPath = (dirPath) => dirPath ? `${basePath}/${dirPath}` : basePath;
const pretiffyNames = (names) => names.map(name => ({ 'original': name, 'pretty': name }));
const addDirectory = (files) => files.map(file => assign(file, { isDirectory: fs.lstatSync(file.original).isDirectory() }));
const readDir = compose((path) => fs.readdirSync(path).map(dir => path.concat(`/${dir}`)))(filmPath);
const trace = (msg) => (x) => {
  console.log(msg, x.value);
  return x;
};

const Play = {
  execute(path, video) {
    console.log(`path ${path} video ${video}`);
    return startVideo(`${path}${video}`)
      .then(({ stdout, stderr }) => `${video} reproduciendo`)
      .catch(({ stdout, stderr }) => {
        return Boom.conflict(stderr);
      });
  },
  label: 'play',
};

const Stop = {
  execute(video) {
    return stopVideo(video)
      .then(({ stdout, stderr }) => `${video} parado`)
      .catch(({ stdout, stderr }) => {
        return Boom.conflict(stderr);
      });
  },
  label: 'stop',
};

const Actions = [Play, Stop];
const readFilmsInDir = pipe([
  toEither(null),
  map(readDir),
  map(filter(FilterHideFiles)),
  map(pretiffyNames),
  map(addDirectory),
]);

const LaunchAction = (request, reply) => {

  const acction = Actions.filter(({ label }) => label === request.params.action);
  return acction[0].execute(`${basePath}${getPath(request)}`, request.params.video);
};

module.exports = { readFilmsInDir, LaunchAction };
