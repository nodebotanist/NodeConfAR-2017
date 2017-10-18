'use strict';

const five = require('johnny-five'),
Tessel = require('tessel-io'),
board = new five.Board({
  io: new Tessel()
}),
DotStar = require('./dotstar'),
lights = new DotStar(15, 'A');

const AdafruitSerialLCD = require('adafruit-serial-lcd')

let serialLCD = new AdafruitSerialLCD({
  port: '/dev/ttyACM0',
  baud: 9600
})

board.on('ready', function() {
  lights.init(4000000);

  lights.test();

  serialLCD.on('ready', () => {
    serialLCD.setSize(20, 4)
    serialLCD.moveCursor(1, 1)
    serialLCD.print("ABCDEFGHIJABCDEFGHIJ")
    serialLCD.moveCursor(1, 2)
    serialLCD.print("********************")
    serialLCD.moveCursor(1, 3)
    serialLCD.print("ABCDEFGHIJABCDEFGHIJ")
    serialLCD.moveCursor(1, 4)
    serialLCD.print("********************")
    setTimeout(serialLCD.clear.bind(serialLCD), 10000)
  })

  serialLCD.start()
});