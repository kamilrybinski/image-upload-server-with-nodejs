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
var done = false;

app.use(less(path.join(__dirname, 'public')));
app.use('/upload', static(__dirname + '/public/upload'));
app.use(static(path.join(__dirname, '/public')));


var author = "Anonimowy";
var imgQty = 0;
var date = new Date();
var d = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();


fs.readFile('public/db/db.json', 'utf-8', function (err, data) {
    if (err) throw err;
    var json = JSON.parse(data);

    // Konfiguracja multera
    app.use(multer({
        dest: './public/upload/',
        rename: function (fieldname, filename) {
            var obj = {
                "nazwa": filename + "-" + d,
                "autor": author 
            };
            json.photos.unshift(obj);
            
            fs.writeFile('public/db/db.json', JSON.stringify(json, null, 3), function(err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Dane zostały zapisane do: db.json");
                }
            });

            return filename + "-" + d;
            },
        onFileUploadStart: function (file) {
          console.log(file.originalname + ' is starting ...');
        },
        onFileUploadComplete: function (file) {
          console.log(file.fieldname + ' uploaded to  ' + file.path);
          done = true;
        }
        }));
    app.get('/', function (req, res) {
        res.sendfile('./public/index.html');
    });

    app.post('/', function (req, res) {
        if (done === true) {
            console.log(req.files);
            console.log('Plik wrzucony');
            res.redirect('back');
        } else {
            console.log('Blad pliku');        
            res.end('Blad pliku');
        }
    });

});


httpServer.listen(port, function () {
	console.log('Serwer HTTP działa na porcie ' + port);
});