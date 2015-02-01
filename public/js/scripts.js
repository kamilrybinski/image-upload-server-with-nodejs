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
        whoIsLogged = '',
        
        imgPath = 'upload/',
        imgsTitles = ['New York', 'New York', 'Nowy Jork', 'Waszyngton', 'Paris', 'Paris', 'Paris', 'Paris', 'Rio', 'Rio De Janeiro', 'Budapest', 'Budapeszt', 'Budapeszt', 'Budapeszt', 'Budapest'],
        imgsAuthors = ['Kamil', 'Kamil', 'test', 'Admin', 'Anonimowy', 'test1', 'test2', 'test3', 'test', 'test4', 'tetet', 'Anonimowy', 'Kamil', 'test7', 'test10'];


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
        var hlinks = document.getElementsByTagName('a'),
            images = document.getElementsByTagName('img'),
            p_imgNums = document.getElementsByClassName('imgNum'),
            p_authors = document.getElementsByClassName('author'),
            //quantityOnPage = 15,
            i = 0,
            j = 0,
            k = 0;

        var imgNames = [];
        $.getJSON("db/db.json", function (data) {
            var items = [],
                itemsL = 0;
            $.each(data, function(key, val) {
                itemsL = val.length; // ilosc plikow w db.json
                console.log("Dlugosc tablicy: " + itemsL);
                for (i; i < itemsL; i++) {
                    items.push(val[i]);
                }
            });
            for (j; j < itemsL; j++) {
                imgNames.push(items[j].nazwa);
            }
            console.log(imgNames);
            
            // ladowanie obrazkow
            var l = itemsL;
            for (k, l; k < itemsL; k++, l--) {
                hlinks[k].href = imgPath + imgNames[k] + ".jpg";
                images[k].src = imgPath + imgNames[k] + ".jpg";
                p_imgNums[k].innerHTML = [l];
                p_authors[k].innerHTML = imgsAuthors[k];
            }
        }); 
    }

    
    createGallery(); 
}());