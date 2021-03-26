const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    },
    allowEIO3: true
});
const PORT = 3050 || process.env.PORT;

const users = [];

io.on('connection', client => {
    let currentUser = null;

    client.on('user_logged', data => {
        
        if(users.includes(data.name)) {
            client.emit('server_callback', 
            { 
                type: 'error', 
                message: 'User with same name already exists!' 
            });
            return;
        }
        
        users.push(data.name);
        currentUser = data;
        client.emit('setUser', data);
        client.emit('server_callback', {
            type: 'success',
            message: 'Authorize success'
        });
        client.broadcast.emit('addMessage', {
            type: 'info',
            sender: 'Server',
            message: `User ${currentUser.name} connected`
        });
    });

    client.on('typing_message', (user) => {
        client.broadcast.emit('someone_typing_message', user)
    })


    client.on('createdMessage', data => {
        client.broadcast.emit('addMessage', data);
    });


    client.on('disconnect', () => {
        if(!currentUser) return;
        users.pop(currentUser.name);
        client.broadcast.emit('addMessage', {
            type: 'info',
            sender: 'Server',
            message: `User ${currentUser.name} disconnected`
        });
    })
});


io.listen(PORT, () => {
    console.log("Server has been started");
});
