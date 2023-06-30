import { productModel } from "../models/product.model.js";

export default class ProductManager {

    addProduct = async (product) => {
        const products = await this.getProducts();
        if(products.find(p => p.code === product.code)){
            return null;
        }  

        const result = await productModel.create(product);
        return result;
    }

    getProducts = async () => {
        const result = await productModel.find({});
        if (result !== null)             
            return result;
        else
            return [];
        
    }

    getProductById = async (pid) => {
        return productModel.findOne({_id:pid})
    }

    updateProduct = async (pid, product) => {
        return await productModel.updateOne({_id:pid}, product);
    }

    deleteProduct = async (pid) => {   
        return await productModel.deleteOne({_id:pid})
    }
};

