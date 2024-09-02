let callFrame;
const socket = io('https://your-heroku-app.herokuapp.com');

async function initializeCall() {
    const roomUrl = 'https://your-daily-domain.daily.co/hello';
    callFrame = await window.DailyIframe.createFrame(
        document.getElementById('video-container'),
        { url: roomUrl }
    );
    await callFrame.join();
}

function findMatch() {
    socket.emit('looking for match');
}

socket.on('match found', (matchId) => {
    console.log('Match found:', matchId);
    initializeCall();
});

document.getElementById('chat-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    if (message) {
        sendMessage(message);
        input.value = '';
    }
});

function sendMessage(message) {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
    socket.emit('chat message', message);
}

socket.on('chat message', (msg) => {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += `<p><strong>Founder:</strong> ${msg}</p>`;
});

// Start looking for a match when the page loads
findMatch();
