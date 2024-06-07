const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('gameId');//get gameid by url

document.getElementById('back-to-lobby-btn').addEventListener('click', () => {
    window.location.href = '/lobby.html';
});//when push a button will be back to lobby

socket.emit('joinGame', { gameId });//when enter at this page this command will send joinGame along with parameter gameId to server

socket.on('gameUpdate', (gameState) => {// wait for gameUpdate
    const playersListDiv = document.getElementById('players-list');
    playersListDiv.innerHTML = '';
    gameState.players.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.innerText = `Player ID: ${player.id}`;
        playersListDiv.appendChild(playerDiv);
    });

    // Render the game board using gameState (if needed)
});

socket.on('roomJoined', ({ gameId }) => {
    const roomIdDiv = document.getElementById('room-id');
    roomIdDiv.innerText = `Room ID: ${gameId}`;
});
