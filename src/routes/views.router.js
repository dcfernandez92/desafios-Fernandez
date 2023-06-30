import { Router } from 'express';
import ProductManager from '../dao/managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

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

export default router;