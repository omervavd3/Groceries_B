import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type: Array,
        required: true,
    },
    products: {
        type: Array,
        default: []
    }
})

export default mongoose.model('CartModel', cartSchema);