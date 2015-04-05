module.exports = {
    server: {
        port: 3000
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
            channel: 'RECOGNITION_CHANNEL'
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
    		developer_key: 'AIzaSyCasG272lrvx2e7FgbjTGFp9X7kHQFk71Y'
    	}
    },
    lookup: {
        type: 'mongodb',  // ['file', 'mongodb', 'mysql']
        /* options: {
            dataFile: 'data/peernames.json'
        } */
        options: {
            url: 'mongodb://localhost/test',
            collection: 'test'
        }
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