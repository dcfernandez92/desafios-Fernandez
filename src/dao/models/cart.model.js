import mongoose, {trusted} from "mongoose";

const userCollection = "carts";

const userSchema = new mongoose.Schema({
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'productModel'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
});

export const cartModel = mongoose.model(userCollection, userSchema);