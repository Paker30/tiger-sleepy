'use strict';

const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const AdaptPath = (path) => path
  .replace(/\s/g, '\\ ')
  .replace(/\[/g, '\\[')
  .replace(/\]/g, '\\]')
  .replace(/\(/g, '\\(')
  .replace(/\)/g, '\\)');

const startVideo = (video) => {
  console.log('reproducir' + AdaptPath(video));
  return new Promise((resolve, reject) => {
    const childProcess = exec(`omxplayer -o hdmi ${AdaptPath(video)}`, (error, stdout, stderr) => {
      if (error) {
        reject({ stdout: '', stderr: `No es posible arrancar: ${video}` });
      }
    });
    setTimeout(() => {
      resolve({ stdout: `Reproduciendo: ${video}`, stderr: '' });
    }, 500);
  });
};

const stopVideo = async (video) => await exec(`killall omxplayer.bin`);

module.exports = { startVideo, stopVideo };
