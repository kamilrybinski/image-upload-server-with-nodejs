/* jshint node: true */
var app = require('express')();
var httpServer = require('http').Server(app);
var io = require('socket.io')(httpServer);

var static = require('serve-static');
var less = require('less-middleware');
var path = require('path');
var multer = require('multer');
var fs = require('fs');
var port = process.env.PORT || 3000;

var uploaded = false;

app.use(static(path.join(__dirname, '/public')));
app.use('/upload', static(__dirname + '/public/upload'));
app.use('/js/jquery.min.js', static(__dirname + '/bower_components/jquery/dist/jquery.min.js'));
app.use('/js/jquery.min.map', static(__dirname + '/bower_components/jquery/dist/jquery.min.map'));

// Dates
var d = new Date(),
    year = d.getFullYear(),
    month = d.getMonth()+1,
    day = d.getDate(),
    hour = d.getHours(),
    minute = d.getMinutes(),
    second = d.getSeconds();

if (month < 10)
    month = "0" + month;
if (day < 10)
    day = "0" + day;
if (hour < 10)
    hour = "0" + hour;
if (minute < 10)
    minute = "0" + minute;
if (second < 10)
    second = "0" + second;

var img_date = year + "-" + month + "-" + day + "-" + hour + "-" + minute + "-" + second;
var add_date = day + "." + month + "." + year + " " + hour + ":" + minute;


var users = {};

fs.readFile('public/db/db.json', 'utf-8', function (err, data) {
    if (err)
        throw err;

    var json = JSON.parse(data);

    // Multer configuration
    app.use(multer({
        dest: './public/upload/',
        rename: function (fieldname, filename) {
            return filename + "-" + img_date;
        },
        onFileUploadStart: function (file) {
            console.log('Starting upload ' + file.originalname);
        },
        onFileUploadComplete: function (file) {
            console.log(file.fieldname + ' uploaded into ' + file.path + ' directory');
            uploaded = true;
        }
    }));
    app.get('/', function (req, res) {
        res.sendFile('./public/index.html');
    });

    app.post('/', function (req, res) {
        if (uploaded === true) {
            console.log('File uploaded successfully');

            var obj = {
                'nazwa': req.files.myfile.name,
                'autor': req.body.author,
                'data_dodania': add_date
            }

            json.photos.unshift(obj);

            fs.writeFile('public/db/db.json', JSON.stringify(json, null, 4), function(err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('Data saved to file: db.json');
                }
            });
            res.end('End');
        }
        else {
            console.log('File error');
            res.end('File error');
        }
    });
});


io.sockets.on('connection', function (socket) {
    socket.on('login', function (username) {
        socket.username = username;
        users[username] = socket;
    });

    socket.on('gallery', function () {
		fs.readFile('public/db/db.json', 'utf-8', function (err, data) {
			if (err) throw err;
			var json = JSON.parse(data);

            io.sockets.emit('showImages', json.photos);
		});
	});

    socket.on('comm', function () {
        // Database with comments
        fs.readFile('public/db/db.json', 'utf-8', function (err, data) {
            if (err) throw err;
            var json = JSON.parse(data);

            socket.emit('comment', json.komentarze);
        });
    });

    socket.on('message', function (data) {
        // Database with comments
        fs.readFile('public/db/db.json', 'utf-8', function (err, data2) {
            if (err) throw err;
            var json = JSON.parse(data2);

            var comment = {
                'nazwa': data.imgName,
                'autor': data.username,
                'tekst': data.text,
            }

            json.komentarze.push(comment);

            // Database with comments
            fs.writeFile('public/db/db.json', JSON.stringify(json, null, 4), function(err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('Comment added');
                }
            });

            io.sockets.emit('comment', json.komentarze);
            io.sockets.emit('newComment', data.imgName);
        });
    });

    socket.on('error', function (err) {
        console.dir(err);
    });

    socket.on('disconnect', function(err){
        delete users[socket.username];
    });
});

// Server listening
httpServer.listen(port, function () {
	console.log('HTTP server running at localhost:' + port);
});
