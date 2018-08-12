const express = require("express"),
    app = express(),
    http = require("http").Server(app),
    io = require("socket.io")(http),
    path = require("path");

app.use(express.static(path.join(__dirname, '../public')));

http.listen(3000, () => {
    console.log(`Conectado a Nodejs`);
});

io.on("connection", socket => {
    console.log(`Conectado a Socket.io`);

    socket.on("info-message", data => {
        socket.broadcast.emit('info-message', data);
    })

    socket.on("chat-message", data => {
        io.emit('chat-message', data);
    })


    socket.on("disconnect", () => {
        console.log("Usuario desconectado de Socket.io");
    });
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/views/index.html'));
});