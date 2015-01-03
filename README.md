voicer
======

AGI yandex voice recognizer

Call to directory, say "Vasya" and asterisk call to Vasya number!


Install
=======

Step 1

Copy app to your server

> git clone https://github.com/antirek/voicer.git

> cd voicer

> npm install


Tune app via *config.js*

1. set yandex developer key ()[]

2. set finder for lookup your peers [db, plain file]


Tune asterisk

add to asterisk extensions.conf

``````
[default]
exten = > 1000,1,AGI(agi://localhost:3000)
``````
ASTERISK CLI> dialplan reload


And run app

> node app.js



And now call to 1000 and enjoy!