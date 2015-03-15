module.exports = {
    port: 3007,
    debug: true,
    record: {    	
    	directory: '/tmp',
    	type: 'wav',
    	duration: 2,
    },
    recognize: {
    	directory: '/tmp',
    	type: 'google',  // ['yandex', 'google']
    	options: {    		
    		developer_key: 'AIzaSyC3GKVw_sK0Rgaq9qxQgLwlGIiUMvDykH8'
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