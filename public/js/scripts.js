window.addEventListener("load", function (event) {
    /* jshint browser: true, globalstrict: true, devel: true */
    /* global io: false */
    "use strict";

    var closeUploadBox = document.getElementById("closeUpload"),
        uploadImageInput = document.getElementById("uploadImageInput"),
        uploadBox = document.getElementById("uploadBox"),
        imageComments = document.getElementById("imageComments"),
        imageBig = document.getElementById("imageBig"),
        closeComments = document.getElementById("closeComments"),
        id = document.getElementById("imageBig"),
        imageName = document.getElementById("imageName"),
        gallery = document.getElementById("gallery");

    var clickedImage = "";


    // login | sockets
    var open = document.getElementById("open"); // login
    var close = document.getElementById("close"); // logout
    var upload = document.getElementById("uploadMenuBtn"); // upload
    var send = document.getElementById("send"); // send
    var message = document.getElementById("message"); // comment
    var text = document.getElementById("comment"); // comment input
    var socket;

    var username = document.getElementById("username");
    var author = document.getElementsByName("author")[0];

    close.disabled = true;
    send.disabled = true;

    open.addEventListener("click", function (event) {
        open.disabled = true;

        if (!socket || !socket.connected) {
            socket = io({forceNew: true});
        }

        socket.on("connect", function () {
            close.disabled = false;
            send.disabled = false;
            username.disabled = true;
            console.log("Nawiązano połączenie przez Socket.io");
            upload.style.display = "block";
            author.value = username.value;
            socket.emit("login", username.value);
            socket.emit("gallery");
        });

        socket.on("disconnect", function () {
            open.disabled = false;
            username.disabled = false;
            username.value = "";
            console.log("Połączenie przez Socket.io zostało zakończone");
        });

        socket.on("error", function (err) {
            message.textContent = "Błąd połączenia z serwerem: '" + JSON.stringify(err) + "'";
        });

        socket.on("comment", function (data) {
            message.innerHTML = "";
            for (var i = 0; i < data.length; i++) {
                var new_p = document.createElement('p');
                if (data[i].nazwa == clickedImage) {
                    new_p.innerHTML = "<strong>" + data[i].autor + "</strong>: " + data[i].tekst;
                    message.appendChild(new_p);
                }
            }
        });

        socket.on("newComment", function (data) {
            var imgId = document.getElementById(data);
            // Get commented image span
            var spanId = document.getElementById(data + "+kom");
            spanId.textContent = "Nowy komentarz";

            // Remove notification after click
            imgId.addEventListener("click", function (event) {
                spanId.textContent = "";
            });
        });

        socket.on("showImages",function (data) {
            var imgPath = "upload/",
                image = "";

            for (var i = 0; i < data.length; i++) {
                image += "<div class='galleryImg'><img class='newComment' id='" + data[i].nazwa + "' src='" + imgPath + data[i].nazwa + "'><span class='nowyKomentarz' id='" + data[i].nazwa + "+kom'></span><span class='imageAutor'>Autor: " + data[i].autor +  "</span><span class='imageAddDate'>Data dodania: " + data[i].data_dodania + "</span></div>";
            }

            gallery.innerHTML = image;
            image = "";
		});

        // ajax upload
        $("#uploadForm").submit(function (event) {
            event.preventDefault();
            var formData = new FormData($(this)[0]);

            $.ajax({
                url: $(this).attr("action"),
                type: $(this).attr("method"),
                data: formData,
                async: false,
                contentType: false,
                processData: false,
                success: function (res) {
                    console.log(res);
                    socket.emit("gallery");
                },
                error: function () {
                    alert("Problem z uploadem!");
                }
            });
        });

    });

    // Close connection after click „Rozłącz”
    close.addEventListener("click", function (event) {
        close.disabled = true;
        send.disabled = true;
        open.disabled = false;
        message.textContent = "";
        upload.style.display = "none";
        socket.io.disconnect();
        console.dir(socket);
        gallery.innerHTML = "<h1>Zaloguj się, aby zobaczyć galerię.</h1>";
    });

    // Send message to serwer after click „Wyślij”
    send.addEventListener("click", function (event) {
        socket.emit("message", {text: text.value, username: username.value, imgName: imageName.value});
        text.value = "";
    });

    // uploadBox
    upload.addEventListener("click", function () {
        uploadBox.style.display = "block";
    });
    closeUploadBox.addEventListener("click", function () {
        uploadBox.style.display = "none";
    });

    // Closing uploadBox after click "Przeslij"
    uploadImageInput.addEventListener("click", function () {
        uploadBox.style.display = "none";
    });

    // Close comment window
    closeComments.addEventListener("click", function () {
        imageComments.style.display = "none";
        clickedImage = "";
    });

    // Buttons "Zaloguj" and "Wyloguj"
    open.addEventListener("click", function () {
        close.style.display = "block";
        open.style.display = "none";
    });
    close.addEventListener("click", function () {
        close.style.display = "none";
        open.style.display = "block";
    });


    // Comments window
    $("#gallery").click(function (event) {
        var getImgSrc = event.target.src,
            getImgName = event.target.id; // name = img id

        $("#imageComments").css("display", "block");
        $("#imageBig").attr("src", getImgSrc);

        // Automatic scrolling down on comments
        setInterval(function () {
            var allComments = document.getElementById("allComments");
            allComments.scrollTop = allComments.scrollHeight;
        }, 100);

        // Coping img id (img name) to hidden input
        $("#imageName").val(getImgName);
        clickedImage = getImgName;
        message.innerHTML = "";

        socket.emit("comm");
    });

});
