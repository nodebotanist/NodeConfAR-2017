const http = require('http')
const Router = require('router')

let router = Router()

const server = http.createServer(function(req, res){
  router(req, res, (req, res) => {})
})

const io = require('socket.io')(server, {
  serveClient: false,
})

router.get('/success', (req, res) => {
  console.log('hurrah! Door unlocked!')
  io.emit('identified')
  res.end();
})

io.on('connection', function(socket){
  console.log('a user connected');
})

server.listen(3000);