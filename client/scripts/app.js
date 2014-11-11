// YOUR CODE HERE:
var app = {

  init: function() {
    $('#main').append('<div id="chats"> </div>');
    $('#main').append('<div id="roomSelect"> </div>');
  },
  server: 'https://api.parse.com/1/classes/chatterbox',
  // messages: [],
  message: {
          username: 'Mel Brooks',
          text: 'It\'s good to be the king',
          roomname: 'lobby'
  },

  addFriend: function(friend) {

  },

  clearMessages: function() {
    $('#chats').html("");
  },

  addMessage: function(message) {
    // console.log(message);
    $('#chats').append('<li>' + message.username /*+ "(" + message.createdAt + ")"*/
      + ": " + message.text + '</li>');
  },

  addRoom: function(roomName) {
    $('#roomSelect').append('<li>' + roomName + '</li>')
  },

  send: function() {
    console.log(app.message);
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(app.message),
      contentType: 'application/json',
      success: function (data) {
    console.log(data);

        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function() {
    $.get('https://api.parse.com/1/classes/chatterbox',{"order": "-updatedAt"},
      function (data) {
    console.log(data);

        console.log('chatterbox: Message received');
        for(var i = 0; i < data.results.length; i++) {
          if(data.results[i].text && data.results[i].text.indexOf('<script>') >= 0) {
           data.results[i].text = escapeHtml(data.results[i].text);
          }
          app.addMessage(data.results[i]);
        }
      }
    );
  }
}


 var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

$(document).ready(function() {
  app.init();
  app.fetch();

  $('#refresh').on('click', function() {
    app.clearMessages();
    app.fetch();
  });

  $('.submit').on('click', function() {
    var path = window.location.search;
    var username = path.substring(path.indexOf('='), path.length);
    var value = $('#message').val();
    app.message.username = username;
    app.message.text = value;
    app.message.roomname = "lobby";
    app.send();
//    app.addMessage(app.message);
  });
});



