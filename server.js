const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

let games = [];

app.use(express.static('public')); // เสิร์ฟไฟล์สแตติกจากโฟลเดอร์ public

// เส้นทางสำหรับหน้าหลัก
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/lobby.html'); // หรือไฟล์ HTML ที่คุณต้องการ
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('createGame', () => {
        const gameId = `game-${uuidv4()}`;
        const newGame = { id: gameId, players: [{ id: socket.id }] };
        games.push(newGame);
        socket.join(gameId);
        io.emit('gameList', games);
        socket.emit('gameCreated', gameId);
    });

    socket.on('requestGameList', () => {
        socket.emit('gameList', games);
    });

    socket.on('joinGame', ({ gameId }) => {
        const game = games.find(g => g.id === gameId);
        if (game && game.players.length < 2) {
            game.players.push({ id: socket.id });
            socket.join(gameId);
            io.to(gameId).emit('gameUpdate', game);
            io.emit('gameList', games);
            socket.emit('roomJoined', { gameId });
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        games = games.filter(game => {
            const playerIndex = game.players.findIndex(player => player.id === socket.id);
            if (playerIndex !== -1) {
                game.players.splice(playerIndex, 1);
                if (game.players.length === 0) {
                    return false;
                }
                io.to(game.id).emit('gameUpdate', game);
            }
            return true;
        });
        io.emit('gameList', games);
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
