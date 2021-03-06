'use strict';
const fs = require('fs');
const Boom = require('boom');
const { assign } = require('lodash');
const { toEither, pipe, map, reject, compose: B, splitOn, last, maybe } = require('sanctuary');
const { basePath } = require('../../config/index');
const { startVideo, stopVideo } = require('./helper');

// const FilterHideFiles = (file) => /.*[^.].*/.test(file);  //No tengo que dejar pasar nada que empiece por .
const FilterHideFiles = pipe([splitOn('/'), last, maybe(false)((str) => /^[[.].*/.test(str))]);  //No tengo que dejar pasar nada que empiece por .
const resolveBasePath = (dirPath) => dirPath ? `${basePath}/${dirPath}` : basePath;
const pretiffyNames = (names) => names.map(name => ({ 'original': name, 'pretty': pipe([splitOn('/'), last])(name) }));
const addDirectory = (files) => files.map(file => assign(file, { isDirectory: fs.lstatSync(file.original).isDirectory() }));
const readDir = (path) => {
  try {
    return fs.readdirSync(path).map(dir => path.concat(`/${dir}`));
  } catch (error) {
    return null;
  }
};
const scanDir = B(readDir)(resolveBasePath);
const trace = label => x => {
  console.log(label, x);
  return x;
};

const Play = {
  execute(path, video) {
    console.log(`path ${path} video ${video}`);
    return startVideo('omxplayer -o hdmi ')(`${path}${video}`);
  },
  label: 'play',
};

const Stop = {
  execute(video) {
    console.log(`stop video ${video}`);
    return stopVideo('killall omxplayer.bin')(video);
  },
  label: 'stop',
};

const actions = [Play, Stop];
const readFilmsInDir = pipe([
  scanDir,
  toEither(Boom.conflict('Error reading the path')),
  map(reject(FilterHideFiles)),
  map(pretiffyNames),
  map(addDirectory),
]);

module.exports = { readFilmsInDir, actions };
