var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.get('/', function(req, res) {
   res.send("karthik");
});
io.on('connection', function(socket) {
   console.log('A user connected',socket.id);
   socket.on('disconnect', function () {
      console.log('A user disconnected',socket.id);
   });
   socket.on('message', function (data) {
    console.log(data,"RASCAL",socket.id);
    socket.broadcast.emit('messages',data)
 });
});
http.listen(3000, function() {
   console.log('listening on *:3000');
});