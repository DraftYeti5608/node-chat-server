var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var sanitizeHtml = require('sanitize-html');

var substrings = ["fuck", "shit", "piss", "cunt", "bastard", "patrick"];

function cleanMessage(message) {
	message = message.replace("<", "&lt;");
	if (substrings.some(function(v) { 
		var repl = v;
		message = message.replace(new RegExp(v, "gi"), new Array(v.length + 1).join( "*" ));
	}));
	return message;
}

io.on('connection', function(client) {
    client.on('join', function(name) {
        client.nickname = cleanMessage(name);
    });
    client.on('messages', function(message) {
	message = message + " ";
        var nickname = client.nickname;
	switch (message.substr(0, message.indexOf(" "))) {
		case "/shout":
			client.broadcast.emit('messages', "<h1>"+message.replace("/shout", "")+"</h1>");
			client.emit('messages', "<h1 id='messages'>"+message.replace("/shout", "")+"</h1>");
			break;
		case "/panda":
			client.broadcast.emit('messages', nickname + ": <img src='panda.jpg'/>");
			client.emit('messages', nickname + ": <img src='panda.jpg' />");
			break;
		case "/clear":
			client.broadcast.emit('clear', "c");
			client.emit('clear', "c");		
			break;
		default:
			var clean = cleanMessage(message);
			client.broadcast.emit('messages', nickname + ": " + clean);
			client.emit('messages', nickname + ": " + clean);
	}
    });
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/img'));
server.listen(8080);

