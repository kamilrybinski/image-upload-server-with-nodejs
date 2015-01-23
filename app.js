/* jshint node: true */
var app = require("express")();
var httpServer = require("http").Server(app);
var multer = require('multer');
var io = require("socket.io")(httpServer);

var static = require('serve-static');
var less = require('less-middleware');
var path = require('path');
var port = process.env.PORT || 3000;
var uploaded = false;

app.use(less(path.join(__dirname, 'public')));
app.use('/upload', static(__dirname + '/public/upload'));
app.use('/js/jquery.min.js', static(__dirname + '/bower_components/jquery/dist/jquery.min.js'));
app.use('/js/jquery.min.map', static(__dirname + '/bower_components/jquery/dist/jquery.min.map'));
app.use(static(path.join(__dirname, '/public')));

// Konfiguracja multera
app.use(multer({
	dest: 'public/upload2/',
	rename: function (fieldname, filename) {
		return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
	},
	onFileUploadStart: function (file) {
		uploaded = true;
	},
	onFileUploadComplete: function (file) {
		uploaded = true;
	}
}));

app.get('/', function (req, res) {
	res.sendfile('index.html');
});

app.post('public/upload2/', function (req, res) {
	if (uploaded == true) {
		res.end('Plik wrzucony');
	} else {
		res.end('Błąd pliku');
	}
});

httpServer.listen(port, function () {
	console.log('Serwer HTTP działa na porcie ' + port);
});
