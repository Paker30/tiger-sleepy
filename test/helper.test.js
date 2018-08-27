'use strict';

const Proxyquire = require('proxyquire');
let launchOmxplayer = 'echo ';
let killOmxplayer = 'echo ';
// const helper = Proxyquire('../src/plugins/films/helper', {
//   launchOmxplayer
//   , killOmxplayer
// });
const helper = require('../src/plugins/films/helper');

describe('***** FILM HELPER *****', () => {

  it('check its methods', (done) => {

    expect(helper).toBeInstanceOf(Object);
    expect(helper.startVideo).toBeInstanceOf(Function);
    expect(helper.stopVideo).toBeInstanceOf(Function);
    done();
  });

  it('start Omxplayer', (done) => {
    helper.startVideo('echo ')('Man on fire').then((status) => {
      status.stdout === 'Reproduciendo Man on fire';
      done();
    });
  });

  it('error while starting Omxplayer', (done) => {
    helper.stopVideo('bla ')('Man on fire').catch((status) => {
      status.stderr === 'No es posible arrancar: Man on fire';
      done();
    });
  });

  it('kill Omxplayer', (done) => {
    helper.stopVideo('echo ')('Man on fire').then((status) => {
      done();
    });
  });
});
