import { Router } from "express";
import CartManager from '../dao/managers/CartManager.js'
import ProductManager from "../dao/managers/ProductManager.js";

const router = Router();

const cartManager = new CartManager();
const productManager = new ProductManager();

router.post("/", async (req, res) => {
    const carts = await cartManager.addCart();
    res.status(201).send({status: "success", payload:carts});
});

router.get("/:cid", async (req, res) => {
    const carts = await cartManager.getCartById(parseInt(req.params.cid));
    if (!carts) {
        return res.status(400).send({status:"error",payload:"El id del carrito no existe"});
    }
    res.send({status: "success", payload:carts});
});

router.post("/:cid/products/:pid", async (req, res) => {

    const product = await productManager.getProductById(parseInt(req.params.pid));
    const cart = await cartManager.getCartById(parseInt(req.params.cid));

    if (!cart) {
        return res.status(400).send({status:"error",payload:"No existe un carrito con el id indicado"});
    }

    if (!product) {
        return res.status(400).send({status:"error",payload:"No existe un producto con el id indicado"});
    }

    const carts = await cartManager.addProductToCart(parseInt(req.params.cid), parseInt(req.params.pid));    
    res.status(201).send({status: "success", payload:carts});
});

export default router;