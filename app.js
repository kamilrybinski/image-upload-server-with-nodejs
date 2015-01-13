/* jshint node: true */
var app = require("express")();
var httpServer = require("http").Server(app);
// var io = require("socket.io)(httpServer);

var port = process.env.PORT || 3000;


http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello Worldf\n');
}).listen(3000, '127.0.0.1');

console.log('Serwer HTTP dziala na porcie ' + port);