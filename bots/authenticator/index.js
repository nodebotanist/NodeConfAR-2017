let code = '';
let value = 0;
let debounced = true;
let debouncedCount = 0;

const KEY_MAX = {
  ONE: 1.1,
  TWO: 0.98,
  THREE: 0.89,
  FOUR: 0.82,
  FIVE: 0.76,
  SIX: 0.71,
  SEVEN: 0.67,
  EIGHT: 0.63,
  NINE: 0.59,
  TEN: 0.56,
  ELEVEN: 0.53,
  TWELVE: 0.50
};

const wifi = require("Wifi");
wifi.connect("****", {password:"***"}, function(err){
  console.log("connected? err=", err, "info=", wifi.getIP());
});

setInterval(() => {
  value = analogRead();
  if(value > 0.47 && debounced){
    if(value < KEY_MAX.TWELVE){
      code = "";
      console.log("code cleared");
    } else if (value < KEY_MAX.ELEVEN){
      code += "!";
      console.log(code);
    } else if (value < KEY_MAX.TEN){
      code += "*";
      console.log(code);
    } else if (value < KEY_MAX.NINE){
      code += "9";
      console.log(code);
    } else if (value < KEY_MAX.EIGHT){
      code += "8";
      console.log(code);
    } else if (value < KEY_MAX.SEVEN){
      code += "7";
      console.log(code);
    } else if (value < KEY_MAX.SIX){
      code += "6";
      console.log(code);
    } else if (value < KEY_MAX.FIVE){
      code += "5";
      console.log(code);
    } else if (value < KEY_MAX.FOUR){
      code += "4";
      console.log(code);
    } else if (value < KEY_MAX.THREE){
      code += "3";
      console.log(code);
    } else if (value < KEY_MAX.TWO){
      code += "2";
      console.log(code);
    } else if (value < KEY_MAX.ONE){
      code += "1";
      console.log(code);
    } 
    
    debounced = false;
  } else if (!debounced) {
    debouncedCount++;
    if(debouncedCount >= 10){
      debouncedCount=0;
      debounced=true;
    }
  }
  
  if(code == "***"){
    console.log("success");
    code='';
  }
}, 50);