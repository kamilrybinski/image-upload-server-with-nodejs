/* jshint browser: true, globalstrict: true, devel: true */
/* global io: false */
"use strict";
    
window.addEventListener("load", function (event) {

    var loginMenuBtn = document.getElementById('loginMenuBtn'),
        logoutMenuBtn = document.getElementById('logoutMenuBtn'),
        uploadMenuBtn = document.getElementById('uploadMenuBtn'),
        closeUploadBox = document.getElementById('closeUpload'),
        uploadBox = document.getElementById('uploadBox'),
        who = document.getElementById('who'),
        whoName = document.getElementById('whoName'),
        username = document.getElementById('username'),
        
        isLogged = false,
        whoIsLogged = "";


    // login Menu
    loginMenuBtn.onclick = function () {
        whoIsLogged = username.value;
        isLogged = true;
        
        username.style.display = 'none';
        loginMenuBtn.style.display = 'none';
        logoutMenuBtn.style.display = 'flex';
        
        who.style.display = 'block';
        whoName.innerHTML = whoIsLogged;

        document.getElementById('username').value = "";   
    };
    // logout Menu
    logoutMenuBtn.onclick = function () {
        whoIsLogged = "";
        isLogged = false;
        
        username.style.display = 'flex';
        loginMenuBtn.style.display = 'flex';
        logoutMenuBtn.style.display = 'none'; 
        
        who.style.display = 'none';
    };
    
    
    // uploadBox
    uploadMenuBtn.onclick = function () {
        document.getElementById('uploadBox').style.display = 'block';
    };
    closeUploadBox.onclick = function () {
        document.getElementById('uploadBox').style.display = 'none';
    };


    function createGallery() {
        var imgPath = 'upload/',
            links = document.getElementsByTagName('a'),
            images = document.getElementsByTagName('img'),
            p_imgNums = document.getElementsByClassName('imgNum'),
            p_authors = document.getElementsByClassName('author'),
            p_addDate = document.getElementsByClassName('addDate'),
            i = 0,
            j = 0,
            k = 0;

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
                imgDates.push(items[j].data_dodania)
            }
            
            // ladowanie obrazkow
            var l = itemsLen;
            for (k, l; k < itemsLen; k++, l--) {
                links[k].href = imgPath + imgNames[k] + ".jpg";
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
    
});