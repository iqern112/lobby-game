const socket = io();
//let conGameId = ''; //ตัวแปรเพื่อเก็บไอดีห้องไว้ในหน้าต่างนี้

document.getElementById('new-game-btn').addEventListener('click', () => {
    socket.emit('createGame');//ส่งสัญญาณไปยัง listener
});

socket.on('gameCreated', (gameId) => {//รอรับสัญญาณจากเซิฟเวอร์ คำว่า gameCreated และรับตัวแปร gameId
    //conGameId = gameId;//ให้ไอดีที่ส่งมาเก็บในตัวแปรที่เราสร้างขึ้น
    window.location.href = `/gameRoom.html?gameId=${gameId}`;
});

socket.on('gameList', (games) => {
    const gameListDiv = document.getElementById('game-list');//เข้าถึงองค์ประกอบของเอกสาร html โดยจะคืนค่าออกมาเป็น จริงเท็จ
    gameListDiv.innerHTML = '';//ทำหน้าที่ ทำให้ html เป็นว่าง ''

    games.forEach((game) => {
        const gameDiv = document.createElement('div');//สร้างกล่องข้อความ
        gameDiv.innerText = `Game ID: ${game.id}`;//ใส่ไอดีห้องลงไปในกล่อง
        gameDiv.classList.add('game-item');//ใช้เพื่อเพิ่ม คลาสให้ใน html
                //classList เป็นคำสั่งที่ใช้เพิ่มหรือลบ ชื่อ คลาส
        if (game.players.length < 2) {
            const joinButton = document.createElement('button');//สร้างปุ่ม join
            joinButton.innerText = 'Join';
            joinButton.addEventListener('click', () => {
                window.location.href = `/gameRoom.html?gameId=${game.id}`;
            });
            gameDiv.appendChild(joinButton);
        } else {
            const fullText = document.createElement('span');//สร้างบล็อกข้อความ
            fullText.innerText = 'Full';//ใส่ข้อความ
            gameDiv.appendChild(fullText);
        }

        gameListDiv.appendChild(gameDiv);//เพิ่มกล่องห้องใน gameListDiv
    });
});

window.onload = () => {
    socket.emit('requestGameList');//เมื่อหน้าเว็บโหลดเสร็จจะ emit requestGameList
};
