module.exports = {
    agi: {
        port: 3000
    },
    web: {
        port: 3007
    },
    processing: {
        totalAttempts: 2,
        playGreeting: true,
        playBeepBeforeRecording: false   //use system beep
    },
    asterisk: {
        sounds: {
            onErrorBeforeFinish: 'invalid',
            onErrorBeforeRepeat: 'invalid',
            greeting: 'tt-monkeysintro'
        },
        recognitionDialplanVars: {
            result: 'RECOGNITION_RESULT',
            target: 'RECOGNITION_TARGET'
        }
    },
    record: {
    	directory: '/tmp',
    	type: 'wav',
    	duration: 2,
    },
    recognize: {
    	directory: '/tmp',
    	type: 'google',  // ['yandex', 'google']
    	options: {
    		developer_key: 'AIzaSyAp3pT4JHBt9PI8-pJ6QNXXdyGRqD7O_3M'
    	}
    },
    lookup: {
        type: 'file',  // ['file', 'mongodb', 'mysql']
        options: {
            dataFile: 'data/peernames.json'
        }
        /*options: {
            url: 'mongodb://localhost/test',
            collection: 'test'
        }*/
    },
    logger: {
        console: {
            colorize: true
        },
        syslog: {
            host: 'localhost'
        },
        file: {
            filename: '/var/log/voicer.log',
            json: false
        }
    }
};