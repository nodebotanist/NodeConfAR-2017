'use strict';

const five = require('johnny-five'),
Tessel = require('tessel-io'),
board = new five.Board({
  io: new Tessel()
}),
DotStar = require('./dotstar'),
lights = new DotStar(15, 'A');

const request = require('request')

let secrets = require('./secrets')

let eventQueue = []

const AdafruitSerialLCD = require('adafruit-serial-lcd')

let serialLCD = new AdafruitSerialLCD({
  port: '/dev/ttyACM0',
  baud: 9600
})

function getEvents() {
  request(secrets.EVENTS_URL, (err, res, body) => {
    if(err){
      console.log(err)
    } else {
      parseEventText(JSON.parse(JSON.parse(body).body).message.Items);
    }
  })
}

function parseEventText(eventData) {
  for(let i=0; i < eventData.length; i++){
    let message = ''

    switch(eventData[i].type){
      case 'Github Push':
        message = 'Nodebotanist pushed to the ' + eventData.repo + ' repo!'
        break
      case 'Tweet':
        message = 'Nodebotanist just tweeted!'
        break
    }

    eventQueue.push(message)
  }

  console.log(eventQueue)
}
  

board.on('ready', function() {

  lights.init(4000000);
  lights.test();

  serialLCD.on('ready', () => {
    setInterval(() => {

    }, 5000);
  })

  serialLCD.start()
})

getEvents()
setInterval(getEvents, 10000)