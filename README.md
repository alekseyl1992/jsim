jsim
====

There are 3 modules in this project:
* core - discrete event simulation Java library
* frontend - NodeJS based HTTP-server, which provides web interface for designing M/M/1 models
* server - Java + Rabbit MQ based server designed to simulate models sent by user via frontend

UI:
![banner](https://raw.githubusercontent.com/alekseyl1992/jsim/master/banner.png)

Rabbit MQ API references:
* java - http://www.rabbitmq.com/api-guide.html
* node - https://github.com/squaremo/amqp.node
