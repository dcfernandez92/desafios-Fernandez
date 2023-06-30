import MessageModel from '../models/message.model.js';

class MessageManager {
    async getMessages() {
        try {
            const messages = await MessageModel.find();
            return messages;
        } catch (error) {
            console.error('Error al obtener los mensajes:', error);
            throw error;
        }
    }

    async addMessage(user, message) {
        try {
            const newMessage = await MessageModel.create({
                user,
                message
            });
            return newMessage;
        } catch (error) {
            console.error('Error al agregar el mensaje:', error);
            throw error;
        }
    }
}

export default MessageManager;