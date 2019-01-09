'use strict';

// const path = require('path');


const uuidv4 = require('uuid/v4');


const Q = require('q');

const Handler = function(source, recognizer, config) {
  let counter = 1;
  let logger;
  const sounds = config.asterisk['sounds'];
  const dialplanVars = config.asterisk['recognitionDialplanVars'];

  const getCallId = function() {
    const length = 7;
    // magic from https://gist.github.com/aemkei/1180489#file-index-js
    const q = function(a, b) {
      return ([1e15]+a).slice(-b);
    };
    return q(counter++, length);
  };

  this.setLogger = function(loggerIn) {
    logger = loggerIn;
  };

  this.handle = function(context) {
    const callId = getCallId();
    let currentAttempt = 1;


    const totalAttempts = config.processing['totalAttempts'] || 1;

    /**
     *
     * @param {*} message
     * @param {*} object
     */
    function log(message, object) {
      if (logger) {
        if (object) {
          logger.info(callId, message, object);
        } else {
          logger.info(callId, message);
        }
      }
    };

    if (logger) {
      recognizer.setLogFunction(log);
    }

    const filename = uuidv4();

    const stepGreeting = function() {
      log('stepGreeting');
      return context.answer()
          .then(function() {
            if (config.processing['playGreeting']) {
              return context.streamFile(sounds['greeting'], '#');
            } else {
              return Q.resolve();
            }
          });
    };

    const stepRecord = function() {
      const conf = config.record;


      const filepath = conf['directory'] + '/' + filename;
      const beep = (config.processing['playBeepBeforeRecording']) ? 'beep' : '';

      log('stepRecord', filepath);
      return context.recordFile(filepath, conf['type'],
          '#', conf['duration'], 0, beep, '');
    };

    const stepRecognize = function() {
      const conf = config.recognize;


      const file = conf['directory'] + '/' + filename + '.wav';

      log('stepRecognize', file);
      return recognizer.recognize(file);
    };

    const stepLookup = function(text) {
      log('stepLookup', text);
      return source.lookup(text);
    };

    const stepFinish = function() {
      log('stepFinish');
      return context.end();
    };

    const stepErrorBeforeFinish = function(error) {
      log('stepError', error);
      return context.streamFile(sounds['onErrorBeforeFinish'], '#');
    };

    const stepErrorBeforeRepeat = function(error) {
      log('stepRepeatOnError', error);
      return context.streamFile(sounds['onErrorBeforeRepeat'], '#');
    };

    const stepSuccess = function(object) {
      log('stepSuccess', object);
      return context.setVariable(dialplanVars['status'], 'SUCCESS')
          .then(function() {
            return context.setVariable(dialplanVars['target'], object.target);
          });
    };

    const stepSetFailedVars = function() {
      log('stepSetFailedVars');
      return context.setVariable(dialplanVars['status'], 'FAILED');
    };

    const FlowProcess = function() {
      return stepRecord()
          .then(stepRecognize)
          .then(stepLookup)
          .then(stepSuccess)
          .then(stepFinish);
    };

    const loop = function(promise) {
      if (currentAttempt < totalAttempts) {
        currentAttempt++;

        return promise()
            .fail(function(error) {
              return stepErrorBeforeRepeat(error)
                  .then(function() {
                    log('fail, make next attempt', {
                      current: currentAttempt, total: totalAttempts,
                    });
                    return loop(promise);
                  });
            });
      } else {
        return promise()
            .fail(function(error) {
              return stepErrorBeforeFinish(error)
                  .then(stepFinish);
            });
      }
    };

    context.onEvent('variables')
        .then(function(variables) {
          log('-- start processing');
          log('variables', JSON.stringify(variables));
          return stepSetFailedVars()
              .then(stepGreeting);
        })
        .then(function() {
          return loop(FlowProcess);
        });

    context.onEvent('error')
        .then(function() {
          log('-- error');
          return stepFinish();
        });

    context.onEvent('close')
        .then(function() {
          log('-- close');
        });

    context.onEvent('hangup')
        .then(function() {
          log('-- hangup');
          return stepFinish();
        });
  };
};

module.exports = Handler;
