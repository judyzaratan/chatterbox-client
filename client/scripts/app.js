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
    $('#chats').append('<li>' + message.username + "(" + message.createdAt + ")"
      + ": " + message.text + '</li>');
  },

  addRoom: function(roomName) {
    $('#roomSelect').append('<li>' + roomName + '</li>')
  },

  send: function() {
    $.ajax({
      // always use this url
      url: this.server,
      type: 'POST',
      data: JSON.stringify(app.message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function() {
    $.ajax({
      // always use this url
      url: this.server,
      type: 'GET',
      data: JSON.stringify(app.message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message received');
        for(var i = data.results.length -1; i >= 0; i--) {
          if(data.results[i].text && data.results[i].text.indexOf('<script>') >= 0) {
           data.results[i].text = escapeHtml(data.results[i].text);
          }
          app.addMessage(data.results[i]);
          // console.log(data.results[i].text.indexOf('<script>'));
        }
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to retrieve message');
      }
    });
  },

};

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
});



