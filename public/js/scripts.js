(function () {
    /* jshint browser: true, globalstrict: true, devel: true */
    /* global io: false */
    "use strict";

    var uploadMenuBtn = document.getElementById('uploadMenuBtn'),
        closeUploadBox = document.getElementById('closeUpload'),
        uploadImageInput = document.getElementById('uploadImageInput'),
        uploadBox = document.getElementById('uploadBox'),
        imageComments = document.getElementById('imageComments'),
        closeComments = document.getElementById('closeComments'),
        who = document.getElementById('who'),
        whoName = document.getElementById('whoName'),
        
        isLogged = false,
        whoIsLogged = "";


    window.addEventListener("load", function(event) {

        // logowanie
        var open = document.getElementById("open"); // zaloguj
        var close = document.getElementById("close"); // wyloguj
        //var send = document.getElementById("loginMenuBtn"); // wyslij
        var message = document.getElementById("message");
        var text = document.getElementById("text");
        var socket;
        
        var username = document.getElementById('username');
        
        close.disabled = true;
        //send.disabled = true;
        
        open.addEventListener("click", function (event) {
            open.disabled = true;
            if (!socket || !socket.connected) {
                socket = io({forceNew: true});
            }
            socket.on('connect', function () {
                close.disabled = false;
                //send.disabled = false;
                username.disabled = true;
                console.log('Nawiązano połączenie przez Socket.io');
                // login
                socket.emit('login', username.value);
            });
            socket.on('disconnect', function () {
                open.disabled = false;
                username.disabled = false;
                username.value = "";
                console.log('Połączenie przez Socket.io zostało zakończone');
            });
            socket.on("error", function (err) {
                message.textContent = "Błąd połączenia z serwerem: '" + JSON.stringify(err) + "'";
            });
            socket.on("echo", function (data) {
                message.textContent = data;
            });
        });

        // Zamknij połączenie po kliknięciu guzika „Rozłącz”
        close.addEventListener("click", function (event) {
            close.disabled = true;
            //send.disabled = true;
            open.disabled = false;
            message.textContent = "";
            socket.io.disconnect();
            console.dir(socket);
        });
/*
        // Wyślij komunikat do serwera po naciśnięciu guzika „Wyślij”
        send.addEventListener("click", function (event) {
            socket.emit('message', text.value);
            //console.log('Wysłałem wiadomość: ' + text.value);
            text.value = "";
        });
    */
    });
    
    
    // uploadBox
    uploadMenuBtn.onclick = function () { uploadBox.style.display = 'block'; };
    closeUploadBox.onclick = function () { uploadBox.style.display = 'none'; };
    // zamykanie uploadBox po kliknieciu "Przeslij"
    uploadImageInput.onclick = function () { uploadBox.style.display = "none"; }
    // zamykanie komentarzy
    closeComments.onclick = function () { imageComments.style.display = "none"; }
    
    
    function createGallery() {
        var imgPath = 'upload/',
            //links = document.getElementsByTagName('a'),
            images = document.getElementsByTagName('img'),
            p_imgNums = document.getElementsByClassName('imgNum'),
            p_authors = document.getElementsByClassName('author'),
            p_addDate = document.getElementsByClassName('addDate'),
            i = 0,
            j = 0,
            k = 0,
            m = 0;

        var imgNames = [],
            imgAuthors = [],
            imgDates = [];
        
        $.getJSON("db/db.json", function (data) {
            var items = [],
                itemsLen = 0;
            $.each(data, function(key, val) {
                itemsLen = val.length; // ilosc plikow w db.json
                
                for (i; i < itemsLen; i++) {
                    items.push(val[i]);
                }
            });

            for (j; j < itemsLen; j++) {
                imgNames.push(items[j].nazwa);
                imgAuthors.push(items[j].autor);
                imgDates.push(items[j].data_dodania);
            }
            
            // ladowanie obrazkow
            var l = itemsLen;
            for (k, l; k < itemsLen; k++, l--) {
                //links[k].href = imgPath + imgNames[k] + ".jpg";
                images[k].src = imgPath + imgNames[k] + ".jpg";
                p_imgNums[k].innerHTML = l;
                p_authors[k].innerHTML = imgAuthors[k];
                p_addDate[k].innerHTML = imgDates[k];
            }
        });
    }

    
    // Tworzenie galerii
    setInterval(function () {
        createGallery();
    }, 300);
    
}());