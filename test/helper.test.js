'use strict';

const helper = require('../src/plugins/films/helper');

describe('***** FILM HELPER *****', () => {

  it('check its methods', (done) => {

    expect(helper).toBeInstanceOf(Object);
    expect(helper.ReadDir).toBeInstanceOf(Function);
    expect(helper.StartVideo).toBeInstanceOf(Function);
    expect(helper.StopVideo).toBeInstanceOf(Function);
    expect(helper.CheckDir).toBeInstanceOf(Function);
    done();
  });

  it('the current path is a directory', (done) => {

    expect(helper.CheckDir('.')).toBeTruthy();
    done();
  });

  it('should return a list of files', (done) => {

    helper.ReadDir('.').then((files) => {

      expect(Array.isArray(files)).toBeTruthy();
      expect(files.length).toBeGreaterThan(0);
      done();
    });;
  });
});
