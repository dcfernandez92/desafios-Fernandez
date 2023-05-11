import express from 'express';
import ProductManager from './ProductManager.js';

const app =  express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager();

app.get("/products", async (req, res) => {
    const limit = req.query.limit;
    const products = await productManager.getProducts();

    if (limit) {
        const limitedProducts = products.slice(0, limit);
        res.send(limitedProducts);
    } else {
        res.send(products);
    }
});

app.get("/products/:pid", async (req,res) => {
    const products = await productManager.getProductById(parseInt(req.params.pid));
    console.log(products)
    res.send(products);
});

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});