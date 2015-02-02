(function () {
    /*jshint globalstrict: true, devel: true*/
    
    'use strict';

    var loginMenuBtn = document.getElementById('loginMenuBtn'),
        loginBtn = document.getElementById('loginBtn'),
        logoutMenuBtn = document.getElementById('logoutMenuBtn'),
        uploadMenuBtn = document.getElementById('uploadMenuBtn'),
        closeLoginBox = document.getElementById('closeLogIn'),
        closeUploadBox = document.getElementById('closeUpload'),
        closeErrorBox = document.getElementById('closeErrorBox'),
        logInBox = document.getElementById('logInBox'),
        uploadBox = document.getElementById('uploadBox'),
        loginErrorBox = document.getElementById('loginErrorBox'),
        who = document.getElementById('who'),
        whoName = document.getElementById('whoName'),
        
        isLogged = false,
        whoIsLogged = '';


    // loginBox
    loginMenuBtn.onclick = function () {
        logInBox.style.display = 'block';
    };
    closeLoginBox.onclick = function () {
        logInBox.style.display = 'none';
    };

    // uploadBox
    uploadMenuBtn.onclick = function () {
        document.getElementById('uploadBox').style.display = 'block';
    };
    closeUploadBox.onclick = function () {
        document.getElementById('uploadBox').style.display = 'none';
    };
    
    // loginErrorBox
    closeErrorBox.onclick = function () {
        loginErrorBox.style.display = 'none';
    };

    
    // Logowanie
    function login() {
        var username = document.getElementById('username').value,
            password = document.getElementById('password').value,
            u = ['admin'],
            p = ['admin'];
        
        logInBox.style.display = 'none';

        if (username === u[0] && password === p[0]) {
            whoIsLogged = username;
            who.style.display = 'block';
            whoName.innerHTML = whoIsLogged;
            logoutMenuBtn.style.display = 'flex';
            loginMenuBtn.style.display = 'none';
            isLogged = true;
        } else {
            loginErrorBox.style.display = 'block';
            isLogged = false;
        }
        
        document.getElementById('username').value = "";
        document.getElementById('password').value = "";
    }
    loginBtn.addEventListener('click', login, false);

    
    // Wylogowanie
    function logout() {
        who.style.display = 'none';
        whoName.innerHTML = '';
        logoutMenuBtn.style.display = 'none';
        loginMenuBtn.style.display = 'flex';
        isLogged = false;
    }
    logoutMenuBtn.addEventListener('click', logout, false);
    

    // Tworzenie galerii
    function createGallery() {
        var imgPath = 'upload/',
            links = document.getElementsByTagName('a'),
            images = document.getElementsByTagName('img'),
            p_imgNums = document.getElementsByClassName('imgNum'),
            p_authors = document.getElementsByClassName('author'),
            i = 0,
            j = 0,
            k = 0;

        var imgNames = [],
            imgAuthors = [];
        
        $.getJSON("db/db.json", function (data) {
            var items = [],
                itemsLen = 0;
            $.each(data, function(key, val) {
                itemsLen = val.length; // ilosc plikow w db.json
                console.log("Dlugosc tablicy: " + itemsLen);
                
                for (i; i < itemsLen; i++) {
                    items.push(val[i]);
                }
                //console.log("items[0]:");
                //console.log(items[0]);
            });
            
            for (j; j < itemsLen; j++) {
                imgNames.push(items[j].nazwa);
                imgAuthors.push(items[j].autor);
            }
            console.log(imgNames); //nazwy obrazkow
            console.log(imgAuthors); // autorzy obrazkow
            
            
            // ladowanie obrazkow
            var l = itemsLen;
            for (k, l; k < itemsLen; k++, l--) {
                links[k].href = imgPath + imgNames[k] + ".jpg";
                images[k].src = imgPath + imgNames[k] + ".jpg";
                p_imgNums[k].innerHTML = l;
                p_authors[k].innerHTML = imgAuthors[k];
            }
        }); 
    }

    
    createGallery(); 
}());