voicer
======

AGI yandex voice recognizer for Asterisk

Call to special extension, say "Vasya" and Asterisk connect you with Vasya! Excellent!


Install
=======

## Step 1. Copy app to your server ##

> $ git clone https://github.com/antirek/voicer.git

> $ cd voicer

> $ npm install


## Step 2. Tune *config.js*: Select ASR service provider##

1. set type: yandex or google, 

2. set developer key (see Links)


## Step 3. Choose lookup storage for search data

1. set finder type: file, mongo or mysql

2. set connection options for chosen type


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


Also you can tune additional options in *config.js*. 

Try find optimal value for duration of record.


Errors?! Bugs?! Oh, contact with me. I want to eat them.


## Links ##

Yandex API key: https://developer.tech.yandex.ru/

Google API key: https://console.developers.google.com/