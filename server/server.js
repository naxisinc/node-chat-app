const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {
  generateMessage,
  generateLocationMessage
} = require('../server/utils/message');

const port = process.env.PORT || 3000;

var app = express();
app.use(express.static(path.join(__dirname, '../public')));

var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', socket => {
  console.log('New user coneccted');

  // Getting Message for joined user
  socket.emit(
    'newMessage',
    generateMessage('Admin', 'Welcome to the chat app')
  );

  // Join notification for every body except to joined user
  socket.broadcast.emit(
    'newMessage',
    generateMessage('Admin', 'New user joined')
  );

  // Listening Event, after that Emit Event from all clients
  socket.on('createMessage', (message, callback) => {
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('This is from the server');
  });

  // Listening Event, after that Emit Event from all clients
  socket.on('createLocationMessage', coords => {
    io.emit(
      'newLocationMessage',
      generateLocationMessage('Admin', coords.latitude, coords.longitude)
    );
  });

  socket.on('disconnect', socket => {
    console.log('User was disconeccted');
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
