'use strict';

const { promisify } = require('util');
const { exec } = require('child_process');
const execPromisify = promisify(require('child_process').exec);
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
  return new Promise((resolve, reject) => {
    exec(cmd + AdaptPath(video), (error, stdout, stderr) => {
      if (error) {
        return reject({ stdout: '', stderr: `No es posible arrancar: ${video}` });
      }

      setTimeout(() => {
        resolve({ stdout: `Reproduciendo: ${video}`, stderr: '' });
      }, 500);
    });
  });
};

const stopVideo = cmd => async (video) => await execPromisify(cmd);

module.exports = { startVideo, stopVideo };
