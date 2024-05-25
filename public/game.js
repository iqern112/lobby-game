const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('gameId');

document.getElementById('back-to-lobby-btn').addEventListener('click', () => {
    window.location.href = '/lobby.html';
});

socket.emit('joinGame', { gameId });

socket.on('gameUpdate', (gameState) => {
    const playersListDiv = document.getElementById('players-list');
    playersListDiv.innerHTML = '';
    gameState.players.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.innerText = `Player ID: ${player.id}`;
        playersListDiv.appendChild(playerDiv);
    });

    // Render the game board using gameState (if needed)
});
