import {cartModel} from '../models/cart.model.js'

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
        const cart = await cartModel.findOne({_id:cid})
        if (cart === null) {
            throw new Error('No existe un carrito con el id indicado');
        }
        return cart;
    }

    // getCartById = async (cid) => {

    //     const carts = await this.getCarts();
    //     const existCart = carts.findIndex(p => p.id === id);

    //     if(existCart === -1)
    //         return null;

    //     return carts[existCart]
    // }

    addProductToCart = async (cart, product) => {

        const existProduct = cart.products.findIndex(p => p.productId == product.id)

        if(existProduct !== -1){
            cart.products[existProduct].quantity += 1;
        }
        else{
            cart.products.push({
                productId: product.id,
                quantity: 1
            });
        }
        
        const result = await cartModel.updateOne({_id:cart.id}, cart)
        return result;
    }
    
};