var socket = io();

socket.on('connect', function() {
  console.log('Connected to server');

  // Emit from the to server
  // socket.emit('createMessage', {
  //   from: 'pedro',
  //   text: 'I am Pedro'
  // });
});

// Listening to the server
socket.on('newMessage', function(msg) {
  console.log(msg);
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});
