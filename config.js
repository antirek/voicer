module.exports = {
    port: 3007,
    record: {    	
    	directory: '/tmp',
    	type: 'wav',
    	duration: 1,
    },
    recognize: {
    	directory: '/tmp2',
    	type: 'yandex',
    	developer_key: '3b7b9fba-cbcd-47d1-854a-XXXXXXXXXXXX'
    },
    lookup: {
        type: 'file',
        options: {
            dataFile: 'data/peernames.json'
        }
    }
};