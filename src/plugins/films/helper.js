'use strict';

const { promisify } = require('util');
const execPromisify = promisify(require('child_process').exec);
const { run } = require('node-cmd');
const launchOmxplayer = 'omxplayer -o hdmi ';
const killOmxplayer = 'killall omxplayer.bin';

const AdaptPath = (path) => path
  .replace(/\s/g, '\\ ')
  .replace(/\[/g, '\\[')
  .replace(/\]/g, '\\]')
  .replace(/\(/g, '\\(')
  .replace(/\)/g, '\\)');

const startVideo = (cmd) => (video) => {
  console.log('reproducir' + AdaptPath(video));
  const process = run(cmd + AdaptPath(video));
  return process
    ? Promise.resolve({ stdout: 'reproducir' + AdaptPath(video) })
    : Promise.reject({ stderr: 'reproducir' + AdaptPath(video) });
};

const stopVideo = cmd => async (video) => await execPromisify(cmd);

module.exports = { startVideo, stopVideo };
