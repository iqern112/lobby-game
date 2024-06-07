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

io.on('connection', (socket) => {// io.on คือ เมื่อการตอบกลับจากทุกคนที่ต่อกับ server
    console.log(`User connected: ${socket.id}`);

    socket.on('createGame', () => {
        const gameId = `game-${uuidv4()}`;
        const newGame = { id: gameId, players: [{ id: socket.id }] };
        games.push(newGame);//เพิ่มตัวแปร newGame in arry games
        socket.join(gameId);//join a person who create a game
        io.emit('gameList', games);//ส่งข้อมูลให้ทุกคนที่เชื่อมต่อเซิฟเวอร์
        socket.emit('gameCreated', gameId);//ส่งข้อมูลให้เฉพาะคนที่เป็นผู้สร้างเกม
    });

    socket.on('requestGameList', () => {//เมื่อได้รับ requestGameList จาก user คนนั้นๆ
        socket.emit('gameList', games);//จะทำการส่ง gameList กลับไป พร้อมกับ paramiter games
    });

    socket.on('joinGame', ({ gameId }) => {//when recive joinGame sign
        const game = games.find(g => g.id === gameId);//loop to find a gamId in games arry
        if (game && game.players.length < 2) {//ตรวจสอบว่า game not null and player in room is less then 2
            game.players.push({ id: socket.id });//เพิ่มผู้เล่นใหม่เข้าไปใน arry ที่มีอยู่แล้ว
            socket.join(gameId);//join who are a signal to the room by id GameId 
            io.to(gameId).emit('gameUpdate', game);//ส่งสัญญาณไปเฉพาะกับ user ที่อยู่ในห้องร่วมกัน
            io.emit('gameList', games);//ส่งข้อมูลให้ทุกคน
            socket.emit('roomJoined', { gameId });//send signal roomJoin
            console.log(`Player ${socket.id} joined game ${gameId}`);//print player and id room in terminal
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
