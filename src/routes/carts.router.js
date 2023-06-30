import { Router } from "express";
import CartManager from '../dao/managers/carts.manager.js'
import ProductManager from "../dao/managers/products.manager.js";

const router = Router();

const cartManager = new CartManager();
const productManager = new ProductManager();

router.post("/", async (req, res) => {
    const carts = await cartManager.addCart();
    console.log(carts)
    res.status(201).send({status: "success", payload:carts});
});

router.get("/:cid", async (req, res) => {
    let {cid} = req.params;
    try{        
        const carts = await cartManager.getCartById(cid);

        res.send({status: "success", payload:carts});

    } catch (err) {
        res.status(500).send({ status: "error", payload: err.message });
    }
    
});

router.post("/:cid/products/:pid", async (req, res) => {
    try {
        let { cid, pid } = req.params;
        const cart = await cartManager.getCartById(cid);
        const product = await productManager.getProductById(pid);

        const carts = await cartManager.addProductToCart(cart, product);
        res.status(201).send({ status: "success", payload: carts });
    } catch (err) {
        res.status(500).send({ status: "error", payload: err.message });
    }
});

export default router;