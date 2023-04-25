class ProductManager {

    constructor(){
        this.products = [];
    }

    addProduct(title, description, price, thumbnail, code, stock){
        
        if(!title || !description || !price || !thumbnail || !code || !stock){
            return "Campos obligatorios! No pueden estar vacíos"
        }
        
        const product = {
            title,
            description,
            price,
            thumbnail,
            stock
        }

        product.id = this.products.length === 0 ? product.id = 1 : this.products[this.products.length - 1].id + 1;
        
        const existCode = this.products.find(p => p.code === code);
            
        if(!existCode){
            product.code = code;
            this.products.push(product);
        } 
        else {
            return "El código de producto YA EXISTE!";
        }
        
    }

    getProducts(){
        return this.products;
    }

    getProductById(id){
        const existProduct = this.products.findIndex(p => p.id === id);
        return (existProduct !== -1) ? this.products[existProduct] : "Not Found";       
    }
};

const manejadorProductos = new ProductManager()
console.log("------------------Array Products vacío---------------------")
console.log(manejadorProductos.getProducts());

console.log("------------------Array Products con Datos---------------------")
console.log(manejadorProductos.getProducts(manejadorProductos.addProduct("productPrueba","Este es un producto prueba",200,"Sin imagen","abc123",25)));

console.log("------------------Error code repetido---------------------")
console.log(manejadorProductos.addProduct("productPrueba","Este es un producto prueba",200,"Sin imagen","abc123",25));

console.log("------------------getProductById con ID EXISTENTE---------------------")
console.log(manejadorProductos.getProductById(1));

console.log("------------------getProductById id INEXISTENTE---------------------")
console.log(manejadorProductos.getProductById(2));



