"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cartSchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model("CartModel", cartSchema);
//# sourceMappingURL=cartModel.js.map