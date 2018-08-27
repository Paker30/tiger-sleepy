'use strict';
const fs = require('fs');
const Boom = require('boom');
const { assign } = require('lodash');
const { toEither, pipe, map, filter, compose: B, Left } = require('sanctuary');
const { basePath } = require('../../config/index');
const { startVideo, stopVideo } = require('./helper');

const FilterHideFiles = (file) => /^[^.].*/.test(file);  //No tengo que dejar pasar nada que empiece por .
const resolveBasePath = (dirPath) => dirPath ? `${basePath}/${dirPath}` : basePath;
const pretiffyNames = (names) => names.map(name => ({ 'original': name, 'pretty': name }));
const addDirectory = (files) => files.map(file => assign(file, { isDirectory: fs.lstatSync(file.original).isDirectory() }));
const readDir = (path) => {
  try {
    return fs.readdirSync(path).map(dir => path.concat(`/${dir}`));
  } catch (error) {
    return null;
  }
};
const scanDir = B(readDir)(resolveBasePath);
const trace = (msg) => (x) => {
  console.log(msg, x.value);
  return x;
};

const Play = {
  execute(path, video) {
    console.log(`path ${path} video ${video}`);
    return startVideo('omxplayer -o hdmi ')(`${path}${video}`)
      .then(({ stdout, stderr }) => `${video} reproduciendo`)
      .catch(({ stdout, stderr }) => Boom.conflict(stderr));
  },
  label: 'play',
};

const Stop = {
  execute(video) {
    console.log(`stop video ${video}`);
    return stopVideo('killall omxplayer.bin')(video)
      .then(({ stdout, stderr }) => `${video} parado`)
      .catch(({ stdout, stderr }) => Boom.conflict(stderr));
  },
  label: 'stop',
};

const actions = [Play, Stop];
const readFilmsInDir = pipe([
  scanDir,
  toEither(Boom.conflict('Error reading the path')),
  map(filter(FilterHideFiles)),
  map(pretiffyNames),
  map(addDirectory),
]);

module.exports = { readFilmsInDir, actions };
