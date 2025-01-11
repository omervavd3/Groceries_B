import mongoose from "mongoose";

export interface ICart {
    _id?: string;
    productsIds: string[];
    productsNames: string[];
    productsAmounts: number[];
    productsPrices: number[];
    users: string[];
    admin: string;
    cartName: string;
}

const cartSchema = new mongoose.Schema({
  productsIds: {
    type: [String],
  },
  productsNames: {
    type: [String],
  },
  productsAmounts: {
    type: [Number],
  },
  productsPrices: {
    type: [Number],
  },
  users: {
    type: [String],
  },
  admin: {
    type: String,
    required: true,
  },
  cartName: {
    type: String,
    required: true,
  }
});

export default mongoose.model("CartModel", cartSchema);
