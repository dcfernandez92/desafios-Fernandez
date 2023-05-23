import { Router } from "express";
import ProductManager from "../ProductManager.js"
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
    const products = await productManager.getProductById(parseInt(req.params.pid));
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
    const products = await productManager.addProduct(product);
    
    if (products === null)
        return res.status(400).send({status:"error",payload: "Ya existe un producto con ese code"});
    res.status(201).send({status:"success",payload: products});
});

router.put("/:pid", async (req, res) => {
    const product = req.body;
    product.id = parseInt(req.params.pid);
    const products = await productManager.updateProduct(product);
    if(!products)
        return res.status(400).send({status:"error",payload: "El id de producto no existe"});
    res.send({status:"success",payload: products});
});

router.delete("/:pid", async (req, res) => {
    const products = await productManager.deleteProduct(parseInt(req.params.pid));
    if(!products)
        return res.status(400).send({status:"error",payload: "El id de producto no existe"});
    res.send({status:"success",payload: products});
});

export default router;