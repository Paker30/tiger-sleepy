'use strict';

const Proxyquire = require('proxyquire');
const handler = Proxyquire('../src/plugins/films/handlers', {
  startVideo: (cmd) => (video) => Promise.resolve()
  , stopVideo: (cmd) => (video) => Promise.reject({stderr: 'There has been an erro'})
});
const { either } = require('sanctuary');

describe('***** FILM HANDLER *****', () => {

  it('check its methods', (done) => {

    expect(handler).toBeInstanceOf(Object);
    expect(handler.readFilmsInDir).toBeInstanceOf(Function);
    expect(Array.isArray(handler.actions)).toBe(true);
    done();
  });

  it('reading current location', (done) => {

    either
    ((films) => {console.log('**ERROR FILMS**');})
    ((films) => {
      expect(Array.isArray(films)).toBe(true);
      done();
    })
    (handler.readFilmsInDir('.'));
  });

  it('reading a wrong location', (done) => {

    either
    ((error) => {
      expect(error).toBeInstanceOf(Error);
      done();
    })
    ((films) => films)
    (handler.readFilmsInDir('this location does not exits'));
  });

  it('playing a film', () => handler.actions[0].execute('path to film', 'Man on fire'));

  it('stoping a film', (done) => handler.actions[1].execute('path to film', 'Man on fire'));
});
