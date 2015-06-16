module.exports = {
    agi: {
        port: 3000
    },
    web: {
        port: 3100
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
            greeting: 'beep'
        },
        recognitionDialplanVars: {
            status: 'RECOGNITION_RESULT',
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
    		developer_key: 'AIzaSyBmdtN0y0DwFnIIZgTJyBXLP_M8nsRBcDw'
    	}
    },
    lookup: {
        type: 'file',
        options: {
            dataFile: 'data/peernames.json'
        }
    },
    logger: {
        console: {
            colorize: true
        },
        file: {
            filename: '/var/log/voicer.log',
            json: false
        }
    }
};