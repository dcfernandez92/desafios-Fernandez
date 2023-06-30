import mongoose, { trusted } from "mongoose";

const userCollection = "products";

const userSchema = new mongoose.Schema({
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
        type:String,
        require:true
    },
    category:{
        type:String,
        require:true
    },
    status:Boolean,
    thumbnail:Array
});

export const productModel = mongoose.model(userCollection,userSchema);