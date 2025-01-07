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
    type: Array,
    default: [],
  },
  productsNames: {
    type: Array,
    default: [],
  },
  productsAmounts: {
    type: Array,
    default: [],
  },
  productsPrices: {
    type: Array,
    default: [],
  },
  users: {
    type: Array,
    default: [],
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
