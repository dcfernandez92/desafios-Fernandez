const socket = io();
const chatMessagesElement = document.getElementById('chat-messages');
const emailInputElement = document.getElementById('email-input');
const messageInputElement = document.getElementById('message-input');
const sendButtonElement = document.getElementById('send-button');

sendButtonElement.addEventListener('click', () => {
    const email = emailInputElement.value;
    const message = messageInputElement.value;

    fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: email,
                message: message
            })
        })
        .then(response => response.json())
        .then(data => {
            // Eliminar mensaje anterior
            const previousMessageElement = document.getElementById(`message-${data.index}`);
            if (previousMessageElement) {
                previousMessageElement.remove();
            }

            // Agregar nuevo mensaje
            const newMessageElement = document.createElement('p');
            newMessageElement.textContent = `${data.user}: ${data.message}`;
            newMessageElement.id = `message-${data.index}`;
            chatMessagesElement.appendChild(newMessageElement);

            emailInputElement.value = '';
            messageInputElement.value = '';
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

socket.on('newMessage', message => {
    const newMessageElement = document.createElement('p');
    newMessageElement.textContent = `${message.user}: ${message.message}`;
    chatMessagesElement.appendChild(newMessageElement);
});