module.exports = {
    port: 3000,
    debug: true,
    record: {
    	directory: '/tmp',
    	type: 'wav',
    	duration: 2,
    },
    recognize: {
    	directory: '/tmp',
    	type: 'yandex',  // ['yandex', 'google']
    	options: {
    		developer_key: '3b7b9fba-cbcd-47d1-854a-b359ca0e5da5qqq'
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