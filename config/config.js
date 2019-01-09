module.exports = {
  agi: {
    port: 3000,
  },
  web: {
    port: 3100,
    auth: true,
    username: 'vasya',
    password: 'password',
    realm: 'My company',
  },
  processing: {
    totalAttempts: 2,
    playGreeting: true,
    playBeepBeforeRecording: false, // use system beep
  },
  asterisk: {
    sounds: {
      onErrorBeforeFinish: 'invalid',
      onErrorBeforeRepeat: 'invalid',
      greeting: 'beep',
    },
    recognitionDialplanVars: {
      status: 'RECOGNITION_RESULT',
      target: 'RECOGNITION_TARGET',
    },
  },
  record: {
    directory: '/tmp',
    type: 'wav',
    duration: 2,
  },
  recognize: {
    directory: '/tmp',
    type: 'witai', // ['yandex', 'google', 'witai']
    options: {
      developer_key: '6SQV3DEGQWIXW3R2EDFUMPQCVGOEIBCR',
    },
  },
  lookup: {
    type: 'file',
    options: {
      dataFile: 'data/peernames.json',
    },
  },
};
