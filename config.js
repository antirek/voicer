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
    	type: 'google',  // ['yandex', 'google']
    	options: {
    		//developer_key: ''
    		developer_key: ''
    	}
    },
    lookup: {
        type: 'file',  // ['file', 'mongodb', 'mysql']
        options: {
            dataFile: 'data/peernames.json'
        }
    }
};
