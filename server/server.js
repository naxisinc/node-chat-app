const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', socket => {
  console.log('New user coneccted');

  socket.on('disconnect', socket => {
    console.log('User was disconeccted');
  });
});

app.use(express.static(path.join(__dirname, '../public')));

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
