var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var sanitizeHtml = require('sanitize-html');

function cleanMessage(message) {
	message = message.replace(/fuck/gi, "****");
	message = message.replace(/shit/gi, "****");
	return message;
}

io.on('connection', function(client) {
    client.on('join', function(name) {
        client.nickname = name;
    });
    client.on('messages', function(message) {
        var nickname = client.nickname;
	switch (message) {
		case "/panda":
			client.broadcast.emit('messages', nickname + ": <img src='panda.jpg'/>");
			client.emit('messages', nickname + ": <img src='panda.jpg' />");
			break;
		case "/clear":
			client.broadcast.emit('clear', "c");
			client.emit('clear', "c");		
			break;
		default:
			clean = sanitizeHtml(message, {
				allowedTags: [ 'b', 'i', 'em', 'strong'],
				allowedAttributes: {}
			});
			clean = cleanMessage(clean);
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

