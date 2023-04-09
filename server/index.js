const express = require('express');
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const config = require("../config.js");
const api_key = config.api_key;

//const path = `https://youtube.googleapis.com/youtube/v3/search?part=id%2Csnippet&q=${this.q}&type=video&key=${api_key}`
app.use(cors());

const { google } = require("googleapis");
const youtube = google.youtube({
  version: "v3",
  auth: api_key
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5174",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    })

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("play_video", (data) => {
        socket.to(data.room).emit("play_video", data.url);
    });

    socket.on("pause_video", (data) => {
        socket.to(data.room).emit("pause_video", data.time);
    });

    socket.on("seek_video", (data) => {
        socket.to(data.room).emit("seek_video", data.time);
    });

    socket.on("search_videos", (data) => {
        console.log(data.room);
        youtube.search.list({
            part: "id,snippet",
            q: data.query,
            type: "video"
        }).then((response) => {
            socket.emit("search_results", response.data.items);
        }).catch((error) => {
            console.error(error);
        });
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

server.listen(3001, () => {
    console.log("SERVER RUNNING ON PORT 3001")
});