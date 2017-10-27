const LCD_SCK = D23;
const LCD_MOSI = D22;
const LCD_DC = D21;
const LCD_RST = D19;
const LCD_CE = D18;

SPI1.setup({ sck: LCD_SCK, mosi:LCD_MOSI });
var g = require("PCD8544").connect(SPI1, LCD_DC, LCD_CE, LCD_RST, function() {
  g.clear();
  g.drawString("Hello",0,0);
  g.drawLine(0,10,84,10);
  g.flip();
});