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
        imgsNames = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg'],
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
        var images = document.getElementsByTagName('img'),
            p_titles = document.getElementsByClassName('title'),
            p_authors = document.getElementsByClassName('author'),
            quantityOnPage = 15,
            i = 0;
        
        for (i; i <= quantityOnPage - 1; i += 1) {
            images[i].src = imgPath + imgsNames[i];
            p_titles[i].innerHTML = imgsTitles[i];
            p_authors[i].innerHTML = imgsAuthors[i];
        }
        
    }
    
    
    // Wrzucanie obrazka
    function uploadImage() {
        var myFile = document.getElementById('selectFileInput').files[0];
    }
    
    
    
    
    /*
    function getAllFilesFromFolder(dir) {

        var filesystem = require("fs"),
            results = [];

        filesystem.readdirSync(dir).forEach(function (file) {

            file = dir + '/' + file;
            var stat = filesystem.statSync(file);

            if (stat && stat.isDirectory()) {
                results = results.concat(getAllFilesFromFolder(file));
            } else {
                results.push(file);
            }

        });

        //return results;
        console.log(results);

    }
    */
    

    
    createGallery();
    //getAllFilesFromFolder(imgPath);

    
}());