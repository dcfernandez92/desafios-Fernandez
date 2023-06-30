import { Router } from 'express';
import ProductManager from '../dao/managers/ProductManager.js';
import MessageManager from '../dao/managers/message.manager.js';

const router = Router();
const productManager = new ProductManager();
const messageManager = new MessageManager();

router.get('/', async (req, res) => {
    const product = await productManager.getProducts();
    res.render('index', {
        product
    });
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realtimeproducts', {
        products
    });
});

router.get('/chat', async (req, res) => {
    const messages = await messageManager.getMessages();
    const simplifiedMessages = messages.map(message => message.toObject());
    res.render('chat', { messages: simplifiedMessages });
});

router.post('/api/messages', async (req, res) => {
    const { user, message } = req.body;
    const newMessage = await messageManager.addMessage(user, message);
    
    // Obtener el índice del nuevo mensaje
    const messages = await messageManager.getMessages();
    const index = messages.findIndex(m => m._id.toString() === newMessage._id.toString());

    res.json({ ...newMessage.toObject(), index });
});

export default router;