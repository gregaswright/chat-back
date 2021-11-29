const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io');

const port = process.env.PORT || 3000;

const router = require('../routes/router');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"]
    }
  });
  ;


// const publicDirectoryPath = path.join(__dirname, '../public/chat-app-front/public')

// app.use(express.static(publicDirectoryPath))

app.use(router);

io.on('connection', (socket) => {
    console.log('New Web Socket')

    socket.on('join', ({ name, room }, callback) => {
        console.log(name, room)
       
    })

    socket.on('disconnect', () => {
        console.log('User has left')
    })
})

server.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})