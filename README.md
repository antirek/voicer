voicer
======

AGI yandex voice recognizer for Asterisk

Call to special extension, say "Vasya" and Asterisk connect you with Vasya! Excellent!


Install
=======

## Step 1 Copy app to your server ##

> $ git clone https://github.com/antirek/voicer.git

> $ cd voicer

> $ npm install


## Step 2 *config.js*: Select ASR service ##

1. set type: yandex or google, 

2. set developer key (see Links)


## Step 3 *config.js*: Choose lookup type

1. set finder type: file, mongo or mysql

2. set connection options for chosen type

3. Fill data


## Step 4. Tune asterisk ##

1. add to *extensions.conf* number for magic!

``````
[default]
exten = > 1000,1,AGI(agi://localhost:3000)
``````
2. reload dialplan 

> ASTERISK CLI> dialplan reload


## Step 5. Run app ##

from dir of 'voicer'

> node app.js


Congratulations! Now call to 1000 and enjoy! 


## Some more ##

Also you can tune additional options in *config.js*. 

Try find optimal value for duration of record.


## Errors?! ##

Bugs?! Oh, contact with me. I want to eat them.


## Links ##

Yandex API key: https://developer.tech.yandex.ru/

Google API key: https://console.developers.google.com/




## Mongo ##

1. create collection in mongodb

For example:

> mongoimport --db __yourdb__ --collection __yourcollection__ --type json --file peernames.json --jsonArray

> // peernames.json sample in /data 


2. set *config.js* work with mongodb

`````
lookup: {
    type: 'mongodb',
    options: {
        url: 'mongodb://localhost/yourdb',
        collection: 'yourcollection'
    }
}
`````



## MySQL ##

1. create db and table

````
CREATE DATABASE `voicer` CHARACTER SET utf8 COLLATE utf8_general_ci;
CREATE TABLE `peernames` (
	  `id` int(11) NOT NULL AUTO_INCREMENT,
	  `name` varchar(255) NOT NULL,
	  `channel` varchar(255) NOT NULL,
	  PRIMARY KEY (`id`)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8;
````
and fill table data


2. set *config.js* work with mysql

````
lookup: {
    type: 'mysql',
    options: {
        host: 'locahost',
        port: 3306,
        username: 'root',
        password: '1234',
        database: 'voicer',
        table: 'peernames'
    }
}
````