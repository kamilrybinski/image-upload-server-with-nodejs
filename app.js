/* jshint node: true */
var app = require("express")();
var httpServer = require("http").Server(app);
var multer = require('multer');
var io = require("socket.io")(httpServer);

var static = require('serve-static');
var less = require('less-middleware');
var path = require('path');
var port = process.env.PORT || 3000;
var done = false;


app.use(less(path.join(__dirname, 'public')));
app.use('/upload', static(__dirname + '/public/upload'));
app.use('/js/jquery.min.js', static(__dirname + '/bower_components/jquery/dist/jquery.min.js'));
app.use('/js/jquery.min.map', static(__dirname + '/bower_components/jquery/dist/jquery.min.map'));
app.use(static(path.join(__dirname, '/public')));


// Konfiguracja multera
app.use(multer({
	dest: './public/upload3/',
	rename: function (fieldname, filename) {
		return filename + Date.now();
	},
	onFileUploadStart: function (file) {
        console.log("Wrzucanie pliku " + file.originalname + " rozpoczete.");
    },
	onFileUploadComplete: function (file) {
        console.log(file.fieldname + " wrzuco do " + file.path);
		done = true;
	}
}));

app.get('/', function (req, res) {
	//res.sendfile('./public/index.html');
    res.sendfile(__dirname + '/index.html');
});

app.post('', function (req, res) {
	if (done === true) {
        console.log(req.files);
		res.end('Plik wrzucony');
	} else {
		res.end('Blad pliku');
	}
});

httpServer.listen(port, function () {
	console.log('Serwer HTTP działa na porcie ' + port);
});