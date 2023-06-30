import { Router } from "express";
import { io } from '../app.js';
import ProductManager from "../dao/managers/products.manager.js"
import uploader from "../services/uploader.js";

const router = Router();

const productManager = new ProductManager();

router.get("/", async (req, res) => {
    const limit = req.query.limit;
    const products = await productManager.getProducts();

    if (limit) {
        const limitedProducts = products.slice(0, limit);
        res.send({status:"success",payload: limitedProducts});
    } else {
        res.send({status:"success",payload: products});
    }
});

router.get("/:pid", async (req, res) => {
    let {pid}= req.params;
    const products = await productManager.getProductById(pid);
    if (!products) {
        return res.status(404).send({status:"error",payload: "No existe un producto con el id indicado"});
    }
    res.send({status:"success",payload: products});
});

router.post("/", uploader.array("thumbnails"), async (req, res) => {

    const product = req.body;

    const {
        title,
        description,
        price,
        code,
        stock,
        category,
        status
    } = product;

    if (!title || !description || !price || !code || !stock || !category) {
        return res.status(400).send("Todos los campos son requeridos");
    }

    if(!status){
        product.status = true;
    }
    
    product.thumbnails = req.files.map((file) => file.path);
    const result = await productManager.addProduct(product);
    
    if (result === null)
        return res.status(400).send({status:"error",payload: "Ya existe un producto con ese code"});
    
    io.emit('products', result);
    res.status(201).send({status:"success",payload: result});
});

router.put("/:pid", async (req, res) => {
    const productToReplace = req.body;
    let {pid}= req.params;
    if(!productToReplace.title || !productToReplace.description || !productToReplace.price || !productToReplace.code || !productToReplace.stock || !productToReplace.category) 
        return res.status(400).send({status:"error",payload: "No se enviaron todos los campos"});
    const result = await productManager.updateProduct(pid, productToReplace);
    res.send({status:"success",payload: result});
});


router.delete("/:pid", async (req, res) => {
    let {pid} = req.params;
    const result = await productManager.deleteProduct(pid);
    res.send({status:"success",payload: result});
});

export default router;