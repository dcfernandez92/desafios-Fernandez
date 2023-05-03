import fs from 'fs';

class ProductManager {

    constructor() {
        this.path = './Products.json';
    }

    addProduct = async (product) => {

        const products = await this.getProducts();

        if (products.length === 0) {
            product.id = 1;
        } else {
            product.id = products[products.length - 1].id + 1
        }
        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
        return products;

    }

    getProducts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            return products;
        } else {
            return [];
        }
    }

    getProductById = async (id) => {
        const products = await this.getProducts();

        const existProduct = products.findIndex(p => p.id === id);
        return (existProduct !== -1) ? products[existProduct] : "Not Found";

    }

    updateProduct = async (product) => {
        const products = await this.getProducts();

        const index = products.findIndex(p => p.id === product.id);
        if (index !== -1) {
            products.splice(index, 1, product);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        }
    }

    deleteProduct = async (id) => {
        const products = await this.getProducts();

        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex !== -1) {
            products.splice(productIndex, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            return products;
        } else {
            return "Product not found";
        }
    }
};

const manejadorProductos = new ProductManager()

let product = {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
};

let update = {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 450,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 7,
    id: 2
};

let result = await manejadorProductos.addProduct(product);
result = await manejadorProductos.getProducts();
console.log(result);
let productById = await manejadorProductos.getProductById(10);
console.log(productById);
await manejadorProductos.updateProduct(update);
await manejadorProductos.deleteProduct(2);
