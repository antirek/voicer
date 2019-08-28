const Q = require('q');
const Handler = require('../apps/agi/handler');


describe('Handler', function() {
  let handler;
  let context;

  const expectedChannel = 'SIP/1234';
  const expectedText = 'Дмитриев';

  const source = {
    lookup: function(text) {
      const defer = Q.defer();
      defer.resolve(expectedChannel);
      return defer.promise;
    },
  };

  const recognizer = {
    recognize: function(file) {
      const defer = Q.defer();
      defer.resolve(expectedText);
      return defer.promise;
    },
    setLogFunction: function() {},
  };

  /*
  const logger = {
    info: function(module, callId, message, object) {},
  };
  */

  const config = {
    processing: {
      totalAttempts: 2,
      playGreeting: true,
      playBeepBeforeRecording: true,
    },
    asterisk: {
      sounds: {
        onError: 'invalid',
        onErrorRepeat: 'invalid',
        greeting: 'tt-monkeysintro',
        beep: 'beep',
      },
    },
    record: {
      directory: '/tmp',
    },
    recognize: {
      directory: '/tmp',
    },
  };

  const Context = function() {
    const onEvent = function(event) {
      console.log('eee');
      expect(['variables', 'error', 'close', 'hangup'])
          .toEqual(jasmine.arrayContaining([event]));

      return Q.resolve();
    };

    const answer = function() {
      console.log('answer');
      return Q.resolve();
    };

    const setVariable = function(variable, value) {
      console.log('set variable');
      expect([24, 5]).toEqual(jasmine.arrayContaining([value]));
      return Q.resolve();
    };

    const streamFile = function(filename, digits) {
      console.log('stream file');
      return Q.resolve();
    };

    return {
      answer: answer,
      onEvent: onEvent,
      setVariable: setVariable,
      streamFile: streamFile,
    };
  };

  it('standard flow', function(done) {
    context = new Context();
    handler = new Handler({source, recognizer, config});

    handler.handle(context);
    done();
  });
});
