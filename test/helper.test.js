'use strict';

const helper = require('../src/plugins/films/helper');

describe('***** FILM HELPER *****', () => {

  it('check its methods', (done) => {

    expect(helper).toBeInstanceOf(Object);
    expect(helper.startVideo).toBeInstanceOf(Function);
    expect(helper.stopVideo).toBeInstanceOf(Function);
    done();
  });
});
