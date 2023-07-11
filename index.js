const http = require('http');
const express = require('express');
const cors = require('cors');

// Config de .env
require('dotenv').config();

// Creamos app de Express
const app = express();

// Config app de Express
app.use(cors());

// Creación del servidor
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT);

server.on('listening', () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});

// Configuración de Socket.io
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
});
io.on('connection', (socket) => {
    console.log('Se ha conectado un nuevo cliente');
    // Mando un mensaje a todos los clientes conectados menos al que se conecta
    socket.broadcast.emit('mensaje_chat', {
        usuario: 'INFO', mensaje: 'Se ha conectado un nuevo usuario'
    });

    // Actualizo el número de clientes conectados
    io.emit('clientes_conectados', io.engine.clientsCount);

    socket.on('mensaje_chat', (data) => {
        // Emito a todos los clientes conectados
        io.emit('mensaje_chat', data);
    });

    socket.on('disconnect', () => {
        io.emit('mensaje_chat', {
            usuario: 'INFO', mensaje: 'Se ha desconectado un usuario 👋'
        });
        io.emit('clientes_conectados', io.engine.clientsCount);
    });
});