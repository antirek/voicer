module.exports = {
    port: 3007,
    debug: true,
    record: {    	
    	directory: '/tmp',
    	type: 'wav',
    	duration: 2,
    },
    recognize: {
    	directory: '/tmp2',
    	type: 'google',  // ['yandex', 'google']
    	options: {
    		//developer_key: ''
    		developer_key: ''
    	}
    },
    lookup: {
        type: 'mysql',  // ['file', 'mongodb', 'mysql']
        options: {
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '1234',
            database: 'voicer',
            table: 'peernames'
        }
    }
};