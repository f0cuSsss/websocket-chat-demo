
const http = require("http");
const express = require( "express");
const WebSocket = require( "ws");

const app = express();
const server = http.createServer(app);
const wsServer = new WebSocket.Server({ server });
const PORT = 8899 || process.env.PORT;


const dispatchEvent = (ws, payload) => {
    const json = JSON.parse(payload);
    switch (json.event) {
        case "auth": 
        {
            wsServer.clients.forEach(client => client.send(JSON.stringify(
                {
                    event: 'messanger',
                    response: { reciver: 'Server', message: `User ${json.payload.username} logged in` },
                    status: 200
                }
            )))
            ws.send(JSON.stringify(
                { 
                    event: json.event,
                    response: { id: Math.random(500, 99999), user: json.payload.username }, 
                    status: 202
                }
            ));
            break;
        }
        case "messanger": 
        {
            if(!ws) return

            wsServer.clients.forEach(client => client.send(JSON.stringify(
                {
                    event: 'messanger',
                    response: { reciver: 'Server', message: `[${json.payload.reciver}]: ${json.payload.message}` },
                    status: 200
                }
            )))

            wsServer.clients.forEach(client => client.send(JSON.stringify(
                {
                    event: 'messanger',
                    response: { reciver: json.payload.reciver, message: json.payload.message },
                    status: 200
                }
            )))

            ws.send(JSON.stringify(
                {
                    event: 'feedback',
                    response: { messageSentMsg: 'Message sent successfuly' }, 
                    status: '200' 
                }
            ));
            break;
        }
        default: 
            ws.send((new Error("Wrong query")).message);
    }
 }

wsServer.on('connection', ws => {
   ws.on('message', payload => {
    dispatchEvent(ws, payload)
   });


   ws.on("error", e => ws.send(e));
   ws.on("close", () => {
    console.log("User disconnected");
   });
});

server.listen(PORT, () => console.log("Server started"))