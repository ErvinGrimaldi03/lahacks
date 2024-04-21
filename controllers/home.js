const express = require('express');
const middleware = require('../config/middleware');


/*
// Create WebSocket connection.
const socket = new WebSocket("wss://api.hume.ai/v0/stream/models");

// Connection opened
socket.addEventListener("open", (event) => {
   socket.send("Hello Server!");
});

// Listen for messages
socket.addEventListener("message", (event) => {
     console.log("Message from server ", event.data);
});
*/


module.exports.index = async (req, res) => {
    res.render('index');
};



