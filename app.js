/* jshint node: true */
var app = require("express")();
var httpServer = require("http").Server(app);
var io = require("socket.io")(httpServer);
    
var static = require('serve-static');
var less = require('less-middleware');
var path = require('path');
var multer = require('multer');
var fs = require('fs');
var port = process.env.PORT || 3000;

var uploaded = false;

app.use(less(path.join(__dirname, 'public')));
app.use('/upload', static(__dirname + '/public/upload'));
app.use(static(path.join(__dirname, '/public')));


var users = {};
var loggedUser = "Anonimowy";
var komentarze = [];

var imgQty = 0;
var d = new Date(),
    godziny = d.getHours(),
    minuty = d.getMinutes(),
    sekundy = d.getSeconds();

if (godziny < 10)
    godziny = "0" + godziny;
if (minuty < 10)
    minuty = "0" + minuty;
if (sekundy < 10)
    sekundy = "0" + sekundy;

var img_date = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDay() + "-" + godziny + "-" + minuty + "-" + sekundy;
var add_date = d.getDate() + "." + d.getMonth()+1 + "." + d.getFullYear() + " " + godziny + ":" + minuty;

fs.readFile('public/db/db.json', 'utf-8', function (err, data) {
    if (err) throw err;
    var json = JSON.parse(data);

    // Konfiguracja multera
    app.use(multer({
        dest: './public/upload/',
        rename: function (fieldname, filename) {
            var obj = {
                "nazwa": filename + "-" + img_date,
                "autor": loggedUser,
                "data_dodania": add_date
            };
            json.photos.unshift(obj);
            
            fs.writeFile('public/db/db.json', JSON.stringify(json, null, 4), function(err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Dane zostały zapisane do: db.json");
                }
            });

            return filename + "-" + img_date;
            },
        onFileUploadStart: function (file) {
          console.log(file.originalname + ' is starting ...');
        },
        onFileUploadComplete: function (file) {
          console.log(file.fieldname + ' uploaded to  ' + file.path);
          uploaded = true;
        }
    }));
    app.get('/', function (req, res) {
        res.sendfile('./public/index.html');
    });

    app.post('/', function (req, res) {
        if (uploaded === true) {
            console.log(req.files);
            console.log('Plik wrzucony');
            //res.redirect('back');
        }
        else {
            console.log('Blad pliku');        
            res.end('Blad pliku');
        }
    });
});


io.sockets.on("connection", function (socket) {
    socket.on("login", function (username) {
        socket.username = username;
        users[username] = socket;
        //loggedUser = users[username];
        for (var i = 0; i < komentarze.length; i++) {
            socket.emit("echo", komentarze[i]);
        }
    });
    socket.on("message", function (data) {
        komentarze.push(data);
        io.sockets.emit("echo", data);
    });
    socket.on("error", function (err) {
        console.dir(err);
    });
});


httpServer.listen(port, function () {
	console.log('Serwer HTTP działa na porcie ' + port);
});