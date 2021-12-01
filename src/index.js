const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users')

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
        const { error, user } = addUser({ id: socket.id, name, room});

        if(error) return callback(error);

        socket.emit('message', {user: 'admin', text: `${user.name}, welcome to the room ${user.room}`});

        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined`})

        socket.join(user.room);
       
        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', {user: user.name, text: message})

        callback();
    });

    socket.on('disconnect', ({name}) => {
        console.log('User has left')
        io.emit('message', {user: 'admin', text:`${user.name} has left!`})
    })
})

server.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})