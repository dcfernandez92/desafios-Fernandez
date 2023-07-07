import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const userCollection = "products";

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    price:{
        type:String,
        require:true
    },    
    code:{
        type:String,
        unique:true,
        require:true
    },
    stock:{
        type:Number,
        require:true
    },
    category:{
        type:String,
        require:true
    },
    status:Boolean,
    thumbnail:Array
});

productSchema.plugin(mongoosePaginate);
export const productModel = mongoose.model(userCollection,productSchema);