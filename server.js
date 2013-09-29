var app = require('express')();
var server = require('http').createServer(app);
var webRTC = require('webrtc.io').listen(server);

// Express setups
app.configure = (function() {
    console.log("___ Configuring express");
    app.use(express.logger());
    
    // parse request bodies (req.body)
    app.use(express.bodyParser());
    // support _method (PUT in forms etc)
    app.use(express.methodOverride());
    
    // ignore GET /favicon.ico
    app.use(express.favicon());
    
    // To serve the script files from '/public' folder,
    // use the 'express.static' middleware
    // public folder serves all the js,css,images for the client
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
});

var port = process.env.PORT || 8080;
server.listen(port);

console.log("running server");

// get/post routing
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/style.css', function(req, res) {
  res.sendfile(__dirname + '/public/css/style.css');
//  res.sendfile(__dirname + '/style.css');
});

app.get('/fullscrean.png', function(req, res) {
  res.sendfile(__dirname + '/fullscrean.png');
//  res.sendfile(__dirname + '/fullscrean.png');
});

app.get('/script.js', function(req, res) {
  res.sendfile(__dirname + '/public/js/script.js');
//  res.sendfile(__dirname + '/script.js');
});

app.get('/webrtc.io.js', function(req, res) {
  res.sendfile(__dirname + '/public/js/webrtc.io.js');
//  res.sendfile(__dirname + '/webrtc.io.js');
});


webRTC.rtc.on('chat_msg', function(data, socket) {
  
  
  var roomList = webRTC.rtc.rooms[data.room] || [];

  for (var i = 0; i < roomList.length; i++) {
    var socketId = roomList[i];

    if (socketId !== socket.id) {
      var soc = webRTC.rtc.getSocket(socketId);

      if (soc) {
        soc.send(JSON.stringify({
          "eventName": "receive_chat_msg",
          "data": {
            "messages": data.messages,
            "color": data.color
          }
        }), function(error) {
          if (error) {
            console.log(error);
          }
        });
      }
    }
  }
});
