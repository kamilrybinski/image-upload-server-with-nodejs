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
    rok = d.getFullYear(),
    miesiac = d.getMonth()+1,
    dzien = d.getDate(),
    godzina = d.getHours(),
    minuta = d.getMinutes(),
    sekunda = d.getSeconds();

if (miesiac < 10) 
    miesiac = "0" + miesiac;
if (dzien < 10)
    dzien = "0" + dzien;
if (godzina < 10)
    godzina = "0" + godzina;
if (minuta < 10)
    minuta = "0" + minuta;
if (sekunda < 10)
    sekunda = "0" + sekunda;

var img_date = rok + "-" + miesiac + "-" + dzien + "-" + godzina + "-" + minuta + "-" + sekunda;
var add_date = dzien + "." + miesiac + "." + rok + " " + godzina + ":" + minuta;

fs.readFile('public/db/db.json', 'utf-8', function (err, data) {
    if (err) throw err;
    var json = JSON.parse(data);

    // Konfiguracja multera
    app.use(multer({
        dest: './public/upload/',
        rename: function (fieldname, filename) {
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
            
            var obj = {
                "nazwa": req.files.myfile.name,
                "autor": req.body.author,
                "data_dodania": add_date
            }
            
            json.photos.unshift(obj);
            
            fs.writeFile('public/db/db.json', JSON.stringify(json, null, 4), function(err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Dane zostały zapisane do: db.json");
                }
            });
            res.redirect('back');
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