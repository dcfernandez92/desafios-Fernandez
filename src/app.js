import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js'
import ProductManager from './dao/managers/ProductManager.js';
import usersRouter from './routes/users.router.js';
import studentsRouter from './routes/students.router.js'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import mongoStore from 'connect-mongo'
import sessionRoutes from './routes/sessions.router.js';

const MONGO_URL = 'mongodb+srv://coderUser:coderUser@codercluster.ujjwffv.mongodb.net/ecommerce';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        store: mongoStore.create({
            mongoUrl: MONGO_URL,
            mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true},
            ttl: 10
        }),
        secret: "secretSession",
        resave: false,
        saveUninitialized: false
    })
);

app.use(express.static(`${__dirname}/public`));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');
app.use('/', viewsRouter);


const server = app.listen(8080, () => console.log("Server running"));

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('Connected to the database');
    })
    .catch(error => {
        console.log("Cannot connect to the database: " + error);
        process.exit();
    });

app.use('/api/users', usersRouter);
app.use('/api/students', studentsRouter);
app.use('/api/sessions', sessionRoutes);

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