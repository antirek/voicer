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
    	type: 'yandex',  // ['yandex', 'google']
    	options: {
    		//developer_key: ''
    		developer_key: ''
    	}
    },
    lookup: {
        type: 'file',
        options: {
            dataFile: 'data/peernames.json'
        }
    }
};