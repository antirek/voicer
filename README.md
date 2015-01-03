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


## Step 2. Tune app via *config.js* ##

1. set yandex developer key (https://developer.tech.yandex.ru/)

2. set finder for lookup your peers [db, plain file]


## Step 3. Tune asterisk ##

add to *extensions.conf* like this

``````
[default]
exten = > 1000,1,AGI(agi://localhost:3000)
``````
ASTERISK CLI> dialplan reload


## Step 4. Run app ##

from dir of 'voicer'

> node app.js



And now call to 1000 and enjoy!