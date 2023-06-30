import fs from 'fs';

export default class CartManager {

    constructor() {
        this.path = './src/Carts.json';
    }

    addCart = async () => {
        const cart = {};
        const carts = await this.getCarts();
        if (carts.length === 0) {
            cart.id = 1;
        } else {
            cart.id = carts[carts.length - 1].id + 1
        }

        cart.products = [];
        carts.push(cart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'))
        return carts;
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

    getCartById = async (id) => {
        const carts = await this.getCarts();
        const existCart = carts.findIndex(p => p.id === id);

        if(existCart === -1)
            return null;

        return carts[existCart]
    }

    addProductToCart = async (cartId, productId) => {
        const carts = await this.getCarts();

        const cartIndex = carts.findIndex(c => c.id === cartId);        
        const productIndex = carts[cartIndex].products.findIndex(p => p.product === productId)

        if (productIndex !== -1) {
            carts[cartIndex].products[productIndex].quantity += 1;
        } else {
            carts[cartIndex].products.push({
                product: productId,
                quantity: 1
            });
        }

        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));

        return carts;
    }


};