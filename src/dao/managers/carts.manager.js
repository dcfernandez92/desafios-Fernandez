import {
    cartModel
} from '../models/cart.model.js'
import ProductManager from './products.manager.js';



export default class CartManager {

    addCart = async () => {
        return await cartModel.create({});
    }

    getCarts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const carts = JSON.parse(data);
            return carts;
        } else {
            return [];
        }
    }

    getCartById = async (cid) => {
        const cart = await cartModel.findOne({
            _id: cid
        })
        if (cart === null) {
            throw new Error('No existe un carrito con el id indicado');
        }
        return cart;
    }

    addProductToCart = async (cart, product) => {

        const existProduct = cart.products.findIndex(p => p.productId._id == product.id)

        if (existProduct !== -1) {
            cart.products[existProduct].quantity += 1;
        } else {
            cart.products.push({
                productId: product.id,
                quantity: 1
            });
        }

        const result = await cartModel.updateOne({
            _id: cart.id
        }, cart)
        return result;
    }

    deleteProductFromCart = async (cart, product) => {

        const productIndex = cart.products.findIndex(p => p.productId._id == product.id)
        if (productIndex !== -1) {
            cart.products.splice(productIndex, 1);
            await cart.save();
            return cart;
        } else throw new Error('No existe el producto en el carrito');
    }

    deleteAllProductsFromCart = async (cartId) => {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            throw new Error('No existe el carrito');
        }

        cart.products = [];
        await cart.save();

        return cart;
    };

    updateProductQuantity = async (cartId, productId, quantity) => {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            throw new Error('No existe el carrito');
        }

        const productIndex = cart.products.findIndex((p) => p.productId._id == productId);
        if (productIndex === -1) {
            throw new Error('No existe el producto en el carrito');
        }

        cart.products[productIndex].quantity = quantity;
        await cart.save();

        return cart;
    };

};