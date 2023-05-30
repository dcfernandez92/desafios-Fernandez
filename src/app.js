import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js'
import ProductManager from './ProductManager.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(`${__dirname}/public`));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');
app.use('/', viewsRouter);

const server = app.listen(8080, () => console.log("Server running"));

const io = new Server(server);
const productManager = new ProductManager();

io.on('connection', socket => {
    console.log('Conectado');

    socket.on('product', async product => {
        const products = await productManager.addProduct(product);

        io.emit('products', products);
    });

    socket.on('deleteProduct', async productId => {
        const products = await productManager.deleteProduct(parseInt(productId));

        io.emit('products', products);
    });
});

export {
    app,
    server,
    io
};