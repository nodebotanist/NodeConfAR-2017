'use strict';

const five = require('johnny-five'),
Tessel = require('tessel-io'),
board = new five.Board({
  io: new Tessel()
});

board.on('ready', function() {


});