'use strict';

const five = require('johnny-five'),
Tessel = require('tessel-io'),
board = new five.Board({
  io: new Tessel()
}),
DotStar = require('./dotstar'),
lights = new DotStar(20, 'A');
const request = require('request')
const color = require('color')

let secrets = require('./secrets')

let eventQueue = []

const AdafruitSerialLCD = require('adafruit-serial-lcd')

console.log("Starting LCD...")
let serialLCD = new AdafruitSerialLCD({
  port: '/dev/ttyACM0',
  baud: 9600
})
console.log("LCD Started.")
function getEvents() {
  request(secrets.EVENTS_URL, (err, res, body) => {
    if(err){
      console.log(err)
    } else if(body != "undefined") {
      parseEventText(JSON.parse(body).message.Items);
    } else {
      console.log('No body!')
    }
  })
}

function sendEventsToBadge(){
  for(let i=0; i<eventQueue.length; i++){
    request(secrets.BADGE_IP + '?red=' + eventQueue[i].color[0] + '&green=' + eventQueue[i].color[1] + '&blue=' + eventQueue[i].color[2] + '&passcode=' + secrets.BADGE_PASSCODE, (err) => {
      if(err) console.log(err)
    })
  }
}

function parseEventText(eventData) {
  console.log("parsing event text")
  if(eventData.length == 0){
    return
  }

  console.log(eventData)
  for(let i=0; i < eventData.length; i++){
    let message = ''
    let color = []

    switch(eventData[i].type){
      case 'GitHubPush':
        color = [0, 255, 0]
        message = 'Nodebotanist pushed to the ' + eventData[i].repo + ' GitHub repo!'
        break
      case 'Tweet':
        color = [0, 0, 255]
        message = 'Nodebotanist just   tweeted!'
        break
      case 'TwitterFollower':
        color = [0, 0, 255]
        message = 'Nodebotanist just   gained a new Twitterfollower!'
        break
      case 'TwitterMention':
        color = [0, 0, 255]
        message = 'Nodebotanist was    just mentioned on   Twitter!'
        break
      case 'TwitchFollower':
        color = [150, 0, 255]
        message = 'Nodebotanist just   gained a new Twitch follower!'
        break
      case 'TwitchStream':
        color = [150, 0, 255]
        message = 'Nodebotanist just   went live on Twitch!'
        break
      case 'IOpipeEvent':
        color = [0, 255, 100]
        message = 'Nodebotanist just   got an IOpipe alert!'
        break
    }

    eventQueue.push({
      message,
      color
    })
    sendEventsToBadge()
  }
}

let idleInterval, hue = 0;

board.on('ready', function() {
  console.log("Board ready")
  lights.init(4000000);

  let newHue, ledColor, newColor, event, i, j;

  serialLCD.on('ready', () => {
    serialLCD.setBrightness(255)
    serialLCD.setContrast(220)
    setInterval(() => {
      if(eventQueue.length > 0){
        clearInterval(idleInterval)
        i = 0
        j = 0
        hue = 0
        event = eventQueue.pop()
        console.log(event)
        for(i=0; i < lights.numPixels; i++){
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
      } else {
        serialLCD.clear()
        serialLCD.print('Waiting for new     events...')
        clearInterval(idleInterval)        
        idleInterval = setInterval(() => {
          j=0;
          newColor = color('hsl(' + hue + ', 100%, 50%)').rgb().array()
          serialLCD.setBacklightColor({
            red: newColor[0],
            green: newColor[1],
            blue: newColor[2]
          });
          for(j = 0; j < lights.numPixels; j++){
            newHue = j * 10 + hue
            if(newHue > 360){
              newHue -= 360
            }
            ledColor = color('hsl(' + newHue + ', 100%, 50%)').rgb().array();
            ledColor[0] = Math.floor(ledColor[0])
            ledColor[1] = Math.floor(ledColor[1])
            ledColor[2] = Math.floor(ledColor[2])
            lights.setPixel({
              pixel: j,
              color: ledColor
            })
          }

          hue++
          if(hue > 360){
            hue = 0;
          }
        }, 50)
      }
    }, 5000);
  })

  serialLCD.start()
})

getEvents()
setInterval(getEvents, 10000)