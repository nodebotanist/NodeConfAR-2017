const server = require('http').createServer();

const io = require('socket.io')(server, {
  serveClient: false,
});

io.on('connection', function(socket){
  console.log('a user connected');
});

server.listen(3000);