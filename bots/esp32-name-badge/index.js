const LED_RED_PIN = D2;
const LED_GREEN_PIN = D0;
const LED_BLUE_PIN = D4;

const LCD_MISO_PIN = D25;
const LCD_MOSI_PIN = D23;
const LCD_SCK_PIN = D19;
const LCD_DC_PIN = D21;
const LCD_CS_PIN = D22;
const LCD_RESET_PIN = D18;
const LCD_BACKLIGHT_PIN = D5;
const LCD_BAUD = 10000000;

const LCD = require('ILI9341-mod');

var http = require("http");
http.createServer(function (req, res) {
  res.writeHead(200);
  res.end("Hello World");
}).listen(1337);

const wifi = require("Wifi");
wifi.connect("*****", {password:"*****"}, function(err){
  console.log("connected? err=", err, "info=", wifi.getIP());
});

digitalWrite(LCD_BACKLIGHT_PIN, 0); // turn on the backlight
SPI1.setup({miso: LCD_MISO_PIN, mosi: LCD_MOSI_PIN, sck: LCD_SCK_PIN, baud: LCD_BAUD});
var g = LCD.connect(SPI1, LCD_DC_PIN, LCD_CS_PIN, LCD_RESET_PIN, function(){

  let clearTop = () => {
    g.setColor(0,0,0);
    g.fillRect(0,0,320,70);
  };
  
  let statusBarCount = 0;
  
  let addStatusBar = (r, gr, b) => {
    if(statusBarCount == 10){
      clearTop();
      statusBarCount = 0;
    }
    g.setColor(b, gr, r);
    g.fillRect(12 + statusBarCount*30, 10, 32 + statusBarCount*30, 60);
    statusBarCount++;
  };
  
  g.setRotation(2, 1); // fix mirroring issue, flip right-side up
  g.clear();
  g.setFontVector(30);
  g.setColor(0,0.25,0.75);
  g.drawString("Kassandra Perch",12,70);
  g.setFontVector(20);
  g.setColor(1,1,1);
  g.drawString("@nodebotanist",12,110);
  g.setColor(0.1, 0.75, 0);
  g.drawString("DevRel @ IOpipe", 12, 145);
  clearTop();
  setInterval(()=>{
    g.setColor(0,0,0);
    g.fillRect(0,225,160,240);
    g.setColor(1, 0, .25);
    g.setFontVector(10);
    g.drawString(wifi.getIP().ip, 12, 225);
  }, 10000);
  addStatusBar(0,0,1);
  addStatusBar(0,0,1);
  addStatusBar(.5,0,1);
  addStatusBar(0,0,1);
  addStatusBar(0,1,0);
  
});

