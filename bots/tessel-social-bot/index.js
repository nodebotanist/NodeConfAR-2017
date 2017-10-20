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
  if(eventData.length == 0){
    return
  }
  for(let i=0; i < eventData.length; i++){
    let message = ''
    let color = []

    switch(eventData[i].type){
      case 'Github Push':
        color = [0, 255, 0]
        message = 'Nodebotanist pushed to the ' + eventData.repo + ' GitHub repo!'
        break
      case 'Tweet':
        color = [0, 0, 255]
        message = 'Nodebotanist just tweeted!'
        break
      case 'TwitterFollower':
        color = [0, 0, 255]
        message = 'Nodebotanist just gained a new Twitter follower!'
        break
      case 'TwitterMention':
        color = [0, 0, 255]
        message = 'Nodebotanist was just mentioned on Twitter!'
        break
      case 'TwitchFollower':
        color = [150, 0, 255]
        message = 'Nodebotanist just gained a new Twitch follower!'
        break
      case 'TwitchStream':
        color = [150, 0, 255]
        message = 'Nodebotanist just went live on Twitch!'
        break
      case 'IOpipeEvent':
        color = [0, 255, 100]
        message = 'Nodebotanist just got an IOpipe alert!'
        break
    }

    eventQueue.push({
      message,
      color
    })
  }

  console.log(eventQueue)
}
  

board.on('ready', function() {

  lights.init(4000000);

  serialLCD.on('ready', () => {
    setInterval(() => {
      if(eventQueue.length > 0){
        let event = eventQueue.pop()
        console.log(event)
        for(let i=0; i < lights.numPixels; i++){
          lights.setPixel({
            pixel: i,
            color: event.color
          })
          serialLCD.setBacklightColor({
            red: event.color[0],
            green: event.color[1],
            blue: event.color[2]
          })
          serialLCD.clear()
          serialLCD.print(event.message)
        }
      }
    }, 5000);
  })

  serialLCD.start()
})

getEvents()
setInterval(getEvents, 10000)