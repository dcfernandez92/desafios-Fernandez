import { Router } from "express";
import CartManager from '../dao/managers/carts.manager.js'
import ProductManager from "../dao/managers/products.manager.js";
import { cartModel } from "../dao/models/cart.model.js";

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

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        let { cid, pid } = req.params;
        const cart = await cartManager.getCartById(cid);
        const product = await productManager.getProductById(pid);

        const carts = await cartManager.deleteProductFromCart(cart, product);
        res.status(201).send({ status: "success", payload: carts });
    } catch (err) {
        res.status(500).send({ status: "error", payload: err.message });
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await cartManager.deleteAllProductsFromCart(cid);

        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).json({ status: "error", payload: error.message });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        const cart = await cartModel.findByIdAndUpdate(cid, { products }, { new: true });
        if (!cart) {
            return res.status(404).json({ status: 'error', payload: 'No existe el carrito' });
        }
        
        const response = {
        status: 'success',
        payload: cart.products
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ status: 'error', payload: error.message });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
    
        const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
    
        res.status(200).json({ status: "success", payload: updatedCart.products });
    } catch (error) {
        res.status(500).json({ status: "error", payload: error.message });
    }
    });

export default router;