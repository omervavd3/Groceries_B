import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

export interface ICategory {
    _id?: string;
    name: string;
}

export default mongoose.model('CategoryModel', categorySchema);