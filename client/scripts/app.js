// YOUR CODE HERE:
var app = {

  init: function() {
    $('#main').append('<div id="chats"> Chats </div>');
    $('#rooms').append('<div id="roomSelect"> </div>');

    var path = window.location.search;
    console.log(typeof window.location.search);
    var username = escapeHtml(path.substring(path.lastIndexOf('=') + 1, path.length));
    app.myUsername = username;
  },
  currentRoom:"",
  server: 'https://api.parse.com/1/classes/chatterbox',
  myUsername: "",
  roomnames: {},
  message: {
          username: 'Mel Brooks',
          text: 'It\'s good to be the king',
          roomname: 'lobby'
  },
  messageList:[],
  friendList: {},
  addFriend: function(friend) {
    if(!this.friendList[friend] && (friend !== this.myUsername)){
      this.friendList[friend] = friend;
    }

  },

  clearMessages: function() {
    $('#chats').html("Chats");
  },

  addMessage: function(message) {
    console.log(message);
    if(app.friendList[message.username]) {
      $('#chats').append('<li style="font-weight:bold">' + '<a class="username" href="#">'+ message.username + '</a>' /*+ "(" + message.createdAt + ")"*/
        + ": " + message.text + '</li>');
    }
    else {
      $('#chats').append('<li>' + '<a class="username" href="#">'+ message.username + '</a>' /*+ "(" + message.createdAt + ")"*/
        + ": " + message.text + '</li>');
    }
  },

  addRoom: function(roomName) {
    if(roomName) {
      if(!this.roomnames[roomName]){
        this.roomnames[roomName] = roomName;
        $('#roomSelect').append('<li>' + '<a class="room" href="#">'+ roomName + '<a/> </li>');
      }
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

  handleSubmit: function(username, message,roomname){

    app.message.username = username;
    app.message.text = message;
    app.message.roomname = roomname || "lobby";
    app.send();
  },
  fetch: function() {
    $.get('https://api.parse.com/1/classes/chatterbox',{"order": "-updatedAt"},
      function (data) {
        console.log('chatterbox: Message received');
        for(var i = 0; i < data.results.length; i++) {
          data.results[i].text = escapeHtml(data.results[i].text);
          data.results[i].roomname = escapeHtml(data.results[i].roomname);
          data.results[i].username = escapeHtml(data.results[i].username);
          app.messageList.push(data.results[i]);
          app.addRoom(data.results[i].roomname);
        }
      }
    );
  },
  enterRoom: function(roomName){
    console.log(roomName);
    console.log($('title'));
    $('title').html("");
    $('h1').text("chatterbox: " + roomName);
    this.clearMessages();
    this.fetch();
    for(var i = 0; i < this.messageList.length; i++){
      if(this.messageList[i].roomname === roomName){
        this.addMessage(this.messageList[i]);

      }
    }



  }
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
  app.fetch();//store the messages in a property from the fetch
  //app.enterRoom("lobby");//function should filter fetchlist and display messages using the addmessage method




  $('#refresh').on('click', function(e) {
    e.preventDefault();
    app.clearMessages();
    app.fetch();
    if(app.currentRoom){
      app.enterRoom(app.currentRoom);
    }

  });

  $('form').submit(function(e) {
    var value = $('#message').val();
    app.handleSubmit(app.myUsername, value);
  });

  $('.submitRoom').on('click', function(e) {
    e.preventDefault();
    var value = $('#roomname').val();
    app.addRoom(value);
    app.handleSubmit(app.myUsername, "", value);
  });

  $(document).delegate('.room','click',function(){
    app.enterRoom($(this).text());
    app.currentRoom = $(this).text();
  });

  $(document).delegate('.username','click',function(){
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



