'use strict';

const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const Path = require('path');

const ReadDir = (path) =>
  new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(files);
      }
    });
  });

const CheckDir = (path) => fs.lstatSync(path).isDirectory();

const AdaptPath = (path) => path
  .replace(/\s/g,'\\ ')
  .replace(/\[/g,'\\[')
  .replace(/\]/g,'\\]')
  .replace(/\(/g,'\\(')
  .replace(/\)/g,'\\)');

const StartVideo = async (video) => {
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
const StopVideo = async (video) => await exec(`killall omxplayer.bin`);

module.exports = { ReadDir, StartVideo, StopVideo, CheckDir };
