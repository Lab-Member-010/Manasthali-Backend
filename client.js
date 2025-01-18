const socket = io('http://localhost:3001');
textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
        const message = e.target.value;
        socket.emit('send-message', {
            message,
            receiverId: 'some_receiver_id', // replace with actual receiver ID
        });
        e.target.value = '';  // Clear the input field after sending
        appendMessage(message, 'outgoing');
    }
});
socket.on('receive-message', (data) => {
    appendMessage(data.message, 'incoming');
});
function appendMessage(message, type) {
    const mainDiv = document.createElement('div');
    const className = type;  // 'outgoing' or 'incoming'
    mainDiv.classList.add(className, 'message');

    const markup = `<p>${message}</p>`;
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
}
messageArea.scrollTop = messageArea.scrollHeight;
const receiverId = receiverId(); // Your logic to get the receiver ID dynamically
socket.emit('send-message', { message, receiverId });
