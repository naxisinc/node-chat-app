const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const port = process.env.PORT || 3000;

var app = express();
app.use(express.static(path.join(__dirname, '../public')));

var server = http.createServer(app);
var io = socketIO(server);
var users = new Users(); // New User Instance

io.on('connection', socket => {
  socket.on('join', (params, callback) => {
    if (!isRealString('params.name') || !isRealString('params.room')) {
      return callback('Name and room are required');
    }

    var alreadyExist = users.alreadyExist(params.name, params.room);
    if (alreadyExist) {
      return callback(
        'The username is being used in this room, try another one.'
      );
    }

    socket.join(params.room);

    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    // Getting Message for joined user
    socket.emit(
      'newMessage',
      generateMessage('Admin', 'Welcome to the chat app')
    );

    // Join notification for every body except to joined user
    socket.broadcast
      .to(params.room)
      .emit(
        'newMessage',
        generateMessage('Admin', `${params.name} has joined`)
      );

    callback();
  });

  // Listening Event, after that Emit Event from all clients
  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit(
        'newMessage',
        generateMessage(user.name, message.text)
      );
    }
    callback();
  });

  // Listening Event, after that Emit Event from all clients
  socket.on('createLocationMessage', coords => {
    var user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        'newLocationMessage',
        generateLocationMessage(user.name, coords.latitude, coords.longitude)
      );
    }
  });

  socket.on('disconnect', () => {
    console.log('Disconected from the server');
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit(
        'newMessage',
        generateMessage('Admin', `${user.name} has left.`)
      );
    }
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
