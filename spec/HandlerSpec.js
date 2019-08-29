const Handler = require('../apps/agi/handler');

describe('Handler', function() {
  let handler;
  let context;

  const expectedChannel = 'SIP/1234';
  const expectedText = 'Дмитриев';

  const source = {
    lookup: function(text) {
      return Promise.resolve(expectedChannel);
    },
  };

  const recognizer = {
    recognize: function(file) {
      return Promise.resolve(expectedText);
    },
    setLogFunction: function() {},
  };


  const logger = {
    info: function(module, callId, message, object) {},
  };

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
      recognitionDialplanVars: {
        status: 'RECOGNITION_RESULT',
        target: 'RECOGNITION_TARGET',
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
      
      expect(['variables', 'error', 'close', 'hangup'])
          .toEqual(jasmine.arrayContaining([event]));

      return Promise.resolve();
    };

    const answer = function() {
      // console.log('answer');
      return Promise.resolve();
    };

    
    const setVariable = function(variable, value) {
      // console.log('set variable');
      expect(['FAILED']).toEqual(jasmine.arrayContaining([value]));
      return Promise.resolve();
    };

    const streamFile = function(filename, digits) {
      // console.log('stream file');
      return Promise.resolve();
    };

    const end = function() {
      // console.log('end');
      return Promise.resolve();
    };
    const recordFile = function() {
      // console.log('record file');
      return Promise.resolve();
    };

    return {
      answer,
      onEvent,
      setVariable,
      streamFile,
      end,
      recordFile,
    };
  };

  it('standard flow', function(done) {
    context = new Context();
    handler = new Handler({source, recognizer, config, logger});

    handler.handle(context);
    done();
  });
});
