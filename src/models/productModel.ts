import mongoose from "mongoose";
import categoryModel from "./categoryModel";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoryModel',
        required: true
    }
});

export interface IProduct {
    _id?: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    category: any;
}

export default mongoose.model('ProductModel', productSchema);