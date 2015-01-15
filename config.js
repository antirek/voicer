module.exports = {
    port: 3007,
    record: {    	
    	directory: '/tmp',
    	type: 'wav',
    	duration: 2,
    },
    recognize: {
    	directory: '/tmp2',
    	type: 'yandex',  //'yandex', 'google'
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