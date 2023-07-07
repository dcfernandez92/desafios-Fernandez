import mongoose, {trusted} from "mongoose";

const userCollection = "carts";

const cartSchema = new mongoose.Schema({
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
});

cartSchema.pre('findOne', function(){
    this.populate('products.productId');
})

export const cartModel = mongoose.model(userCollection, cartSchema);