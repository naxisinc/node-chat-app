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

  // Getting Message for joined user
  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the chat app'
  });

  // Join notification for every body except to joined user
  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New user joined',
    createAt: new Date().getTime()
  });

  // Listening Event after that Emit Event from all clients
  socket.on('createMessage', message => {
    console.log('createMessage', message);
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  });

  socket.on('disconnect', socket => {
    console.log('User was disconeccted');
  });
});

app.use(express.static(path.join(__dirname, '../public')));

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
