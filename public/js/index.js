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
  // console.log(msg);
  var li = jQuery('<li></li>');
  li.text(`${msg.from}: ${msg.text}`);

  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();

  socket.emit(
    'createMessage',
    {
      from: 'User',
      text: jQuery('#msg').val()
    },
    function() {}
  );
});

var locationBtn = jQuery('#send-location');
locationBtn.on('click', function() {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  navigator.geolocation.getCurrentPosition(function(position) {
    // console.log(position);
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }),
    function() {
      alert('Unable to fetch location');
    };
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});
