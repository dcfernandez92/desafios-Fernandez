import mongoose, { trusted } from "mongoose";

const userCollection = "estudiantes";

const userSchema = new mongoose.Schema({
    first_name:{
        type:String,
        require:true
    },
    last_name:{
        type:String,
        require:true
    },
    age:{
        type:Number,
        require:true
    },    
    dni:{
        type:String,
        unique:true,
        require:true
    },
    course:{
        type:String,
        require:true
    },
    note:{
        type:Number,
        require:true
    }
});

export const studentModel = mongoose.model(userCollection,userSchema);