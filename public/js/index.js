var socket = io();

socket.on('connect', function() {
  console.log('Connected to server');
});

// Listening to the server
socket.on('newMessage', function(msg) {
  // console.log(msg);
  var formattedTime = moment(msg.createAt).format('h:mma');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    from: msg.from,
    text: msg.text,
    createAt: formattedTime
  });

  jQuery('#messages').append(html);
});

// Listening to the server
socket.on('newLocationMessage', function(msg) {
  console.log(msg);
  var formattedTime = moment(msg.createAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: msg.from,
    url: msg.url,
    createAt: formattedTime
  });

  jQuery('#messages').append(html);

  // var li = jQuery('<li></li>');
  // var a = jQuery('<a target="_blank">My current location</a>');

  // li.text(`${msg.from} ${formattedTime}: `);
  // a.attr('href', msg.url);
  // li.append(a);

  // jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();

  var messageTextbox = jQuery('#msg');

  socket.emit(
    'createMessage',
    {
      from: 'User',
      text: messageTextbox.val()
    },
    function() {
      messageTextbox.val('');
    }
  );
});

var locationBtn = jQuery('#send-location');
locationBtn.on('click', function() {
  if (!navigator.geolocation)
    return alert('Geolocation not supported by your browser.');

  locationBtn.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(
    function(position) {
      locationBtn.removeAttr('disabled').text('Send location');
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    function() {
      locationBtn.removeAttr('disabled').text('Send location');
      alert('Unable to fetch location');
    }
  );
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});
