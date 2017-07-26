var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var port = process.env.PORT || 3000;

var id = Math.floor(Math.random() * 1000);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var key = "AIzaSyBGCI441Re4pcBQTTRTBtZupqMB82mg76o";
var cx = "000762501029482588885%3Agp376tgsdck";
var search = "cake";
var num = "&num=3";
var type = "&searchType=image";
var url_request = "https://www.googleapis.com/customsearch/v1?" + "key=" + key + "&cx=" + cx + num + type + "&q=" + search;
var img = "a";

function fetch(){
	url_request = "https://www.googleapis.com/customsearch/v1?" + "key=" + key + "&cx=" + cx + num + type + "&q=" + search;
	request(url_request, function(err, resp, body) {

  if(!err && resp.statusCode == 200) {
    var data = JSON.parse(body);
    console.log(data.items[0].link);
    img = data.items[0].link;
  }
  
  else if (err) {
    console.log("There was an error");
  }

});
}



io.on('connection', function(socket){  
  console.log('user ' + id + " connected");
  socket.on('chat message', function(msg){
    console.log(id + ' : ' + msg);
    search = msg;
    fetch();
    io.emit('data', { sq: img, msg: id + ' : ' + msg });
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
