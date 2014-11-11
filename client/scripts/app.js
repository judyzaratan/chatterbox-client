// YOUR CODE HERE:
var app = {

  init: function() {
    $('#main').append('<div id="chats"> </div>');
    $('#main').append('<div id="roomSelect"> </div>');
  },
  server: 'https://api.parse.com/1/classes/chatterbox',
  myUsername: "",
  roomnames: {},
  message: {
          username: 'Mel Brooks',
          text: 'It\'s good to be the king',
          roomname: 'lobby'
  },
  friendList: {},
  addFriend: function(friend) {
    if(!this.friendList[friend] && (friend !== this.myUsername)){
      this.friendList[friend] = friend;
    }

  },

  clearMessages: function() {
    $('#chats').html("");
  },

  addMessage: function(message) {
    if(app.friendList[message.username]) {
      $('#chats').append('<li style="font-weight:bold">' + '<a class="users" href="#">'+ message.username + '</a>' /*+ "(" + message.createdAt + ")"*/
        + ": " + message.text + '</li>');
    }
    else {
      $('#chats').append('<li>' + '<a class="users" href="#">'+ message.username + '</a>' /*+ "(" + message.createdAt + ")"*/
        + ": " + message.text + '</li>');
    }
  },

  addRoom: function(roomName) {
    if(!this.roomnames[roomName]){
      this.roomnames[roomName] = roomName;
      $('#rooms').append('<li>' + roomName + '</li>');
    }

  },

  send: function() {
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
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
    $.get('https://api.parse.com/1/classes/chatterbox',{"order": "-updatedAt"},
      function (data) {
        console.log('chatterbox: Message received');
        for(var i = 0; i < data.results.length; i++) {
          if(data.results[i].text && data.results[i].text.indexOf('<script>') >= 0) {
           data.results[i].text = escapeHtml(data.results[i].text);
          }
          app.addMessage(data.results[i]);
          app.addRoom(data.results[i].roomname);
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


  $('#refresh').on('click', function(e) {
    e.preventDefault();
    app.clearMessages();
    app.fetch();
  });

  $('.submit').on('click', function(e) {
    e.preventDefault();
    var path = window.location.search;
    var username = path.substring(path.lastIndexOf('=') + 1, path.length);
    var value = $('#message').val();

    app.myUsername = username;
    app.message.username = username;
    app.message.text = value;
    app.message.roomname = "lobby";
    app.send();
  });

  $('.submitRoom').on('click', function(e) {
    e.preventDefault();
    console.log($('#roomname').val());
    var value = $('#roomname').val();
    app.addRoom(value);
  });

  $(document).delegate('.users','click',function(){
    app.addFriend($(this).text());
  });
});

/*
create new rooms, existing rooms
refactor code to filter messages by roomname
create drop down menu for existing rooms
restyle chatterbox
display what room we are currently in
display friend list
add timestamp for messages
*/



