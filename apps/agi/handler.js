
const uuidv4 = require('uuid/v4');
const autoBind = require('auto-bind');

class Handler {
  constructor({source, recognizer, config, logger}) {
    this.source = source;
    this.recognizer = recognizer;
    this.config = config;

    this.counter = 1;
    this.logger = logger;
    this.sounds = config.asterisk['sounds'];
    this.dialplanVars = config.asterisk['recognitionDialplanVars'];
    autoBind(this);    // js костыль для получения this в handle
  }

  getCallId() {
    const length = 7;
    // magic from https://gist.github.com/aemkei/1180489#file-index-js
    const q = (a, b) => {
      return ([1e15]+a).slice(-b);
    };
    return q(this.counter++, length);
  };

  handle(context) {
    const callId = this.getCallId();
    let currentAttempt = 1;

    const totalAttempts = this.config.processing['totalAttempts'];

    /**
     *
     * @param {*} message
     * @param {*} object
     */
    const log = (message, object) => {      
        if (object) {
          this.logger.info(callId, message, object);
        } else {
          this.logger.info(callId, message);
        }
    };
    this.recognizer.setLogFunction(log);
    const filename = uuidv4();

    const stepGreeting = () => {
      log('stepGreeting');
      return context.answer()
          .then(() => {
            log('answer');
            if (this.config.processing['playGreeting']) {
              log('o')
              return context.streamFile(this.sounds['greeting'], '#');
            } else {
              log('b')
              return Promise.resolve();
            }
          });
    };

    const stepRecord = () => {
      const conf = this.config.record;

      const filepath = conf['directory'] + '/' + filename;
      const beep = (this.config.processing['playBeepBeforeRecording']) ? 'beep' : '';

      log('stepRecord', filepath);
      log('stepRecord', 'start record');
      return context.recordFile(filepath, conf['type'],
          '#', conf['duration'], 0, beep, '');
    };

    const stepRecognize = () => {
      const conf = this.config.recognize;
      const file = conf['directory'] + '/' + filename + '.wav';

      log('stepRecognize', file);
      return this.recognizer.recognize(file);
    };

    const stepLookup = (text) => {
      log('stepLookup', text);
      return this.source.lookup(text);
    };

    const stepFinish = () => {
      log('stepFinish');
      return context.end();
    };

    const stepErrorBeforeFinish = (error) => {
      log('stepError', error);
      return context.streamFile(this.sounds['onErrorBeforeFinish'], '#');
    };

    const stepErrorBeforeRepeat = (error) => {
      log('stepRepeatOnError', error);
      return context.streamFile(this.sounds['onErrorBeforeRepeat'], '#');
    };

    const stepSuccess = (object) => {
      log('stepSuccess', object);
      log('stepSuccess, set ' + this.dialplanVars['status'] + '=SUCCESS');
      return context.setVariable(this.dialplanVars['status'], 'SUCCESS')
          .then(() => {
            log('stepSuccess, set ' + this.dialplanVars['target'] + '=' + object.target);
            return context.setVariable(this.dialplanVars['target'], object.target);
          });
    };

    const stepSetFailedVars = () => {
      log('stepSetFailedVars');
      log('set', this.dialplanVars['status'] + '=FAILED');
      return context.setVariable(this.dialplanVars['status'], 'FAILED');
    };

    const FlowProcess = () => {
      return stepRecord()
          .then(res => {
            log('stepRecord', 'end record');
            return res;
          })
          .then(stepRecognize)
          .then(stepLookup)
          .then(stepSuccess)
          .then(stepFinish);
    };

    const loop = (promise) => {
      if (currentAttempt < totalAttempts) {
        currentAttempt++;

        return promise()
            .catch((error) => {
              return stepErrorBeforeRepeat(error)
                  .then(() => {
                    log('---  fail, make next attempt ---', {
                      current: currentAttempt, total: totalAttempts,
                    });
                    return loop(promise);
                  });
            });
      } else {
        return promise()
            .catch((error) => {
              return stepErrorBeforeFinish(error)
                  .then(stepFinish);
            });
      }
    };

    context.onEvent('variables')
        .then((variables) => {
          log('-- start processing');
          log('variables', JSON.stringify(variables));
          return stepSetFailedVars()
              .then(stepGreeting);
        })
        .then(() => {
          return loop(FlowProcess);
        });

    context.onEvent('error')
        .then(() => {
          log('-- error');
          return stepFinish();
        });

    context.onEvent('close')
        .then(() => {
          log('-- close');
        });

    context.onEvent('hangup')
        .then(() => {
          log('-- hangup');
          return stepFinish();
        });
  };
};

module.exports = Handler;
