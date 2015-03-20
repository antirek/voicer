module.exports = {
    server: {
        port: 3000
    },
    processing: {
        totalAttempts: 2,
        playGreeting: true,
        playBeepBeforeRecording: true
    },
    asterisk: {
        sounds: {
            onError: 'invalid',
            onErrorRepeat: 'invalid',
            greeting: 'tt-monkeysintro',
            beep: 'beep'
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
        type: 'file',  // ['file', 'mongodb', 'mysql']
        options: {
            dataFile: 'data/peernames.json'
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