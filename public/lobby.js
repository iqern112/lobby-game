const socket = io();

document.getElementById('new-game-btn').addEventListener('click', () => {
    socket.emit('createGame');
});

socket.on('gameCreated', (gameId) => {
    window.location.href = `/game.html?gameId=${gameId}`;
});

socket.on('gameList', (games) => {
    const gameListDiv = document.getElementById('game-list');
    gameListDiv.innerHTML = '';

    games.forEach((game) => {
        const gameDiv = document.createElement('div');
        gameDiv.innerText = `Game ID: ${game.id}`;
        gameDiv.classList.add('game-item');

        if (game.players.length < 2) {
            const joinButton = document.createElement('button');
            joinButton.innerText = 'Join';
            joinButton.addEventListener('click', () => {
                window.location.href = `/game.html?gameId=${game.id}`;
            });
            gameDiv.appendChild(joinButton);
        } else {
            const fullText = document.createElement('span');
            fullText.innerText = 'Full';
            gameDiv.appendChild(fullText);
        }

        gameListDiv.appendChild(gameDiv);
    });
});

window.onload = () => {
    socket.emit('requestGameList');
};
