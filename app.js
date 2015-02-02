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


var loggedUser = "Anonimowy";
var imgQty = 0;
var d = new Date();
var date_img = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDay() + "-" + d.getHours() + "-" + d.getMinutes() + "-" + d.getSeconds();
var add_date = d.getDate() + "." + d.getMonth()+1 + "." + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();;

var users = ["kamil", "admin"],
    passwords = ["kamil1", "admin1"];


fs.readFile('public/db/db.json', 'utf-8', function (err, data) {
    if (err) throw err;
    var json = JSON.parse(data);

    // Konfiguracja multera
    app.use(multer({
        dest: './public/upload/',
        rename: function (fieldname, filename) {
            var obj = {
                "nazwa": filename + "-" + date_img,
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

            return filename + "-" + date_img;
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