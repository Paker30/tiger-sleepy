'use strict';

const { startServer } = require('../src/server');

describe('***** SERVER *****', () => {

  it('Should return a function to start a server', (done) => {

    expect(startServer).toBeInstanceOf(Function);
    done();
  });

  it('Should return a server', (done) => {

    const manifest = {
      server: {
        port: 9000
      }
    };

    const options = {
      relativeTo: __dirname,
    };

    startServer(manifest, options).then((server) => {

      expect(server).toBeInstanceOf(Object);
      server.stop();
      done();
    });
  });

  it('Should fail starting a server', (done) => {

    startServer().then((server) => {

      expect(server).toBeUndefined();
      done();
    });
  });
});
