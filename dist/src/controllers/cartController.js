"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cartModel_1 = __importDefault(require("../models/cartModel"));
const baseController_1 = __importDefault(require("./baseController"));
class cartController extends baseController_1.default {
    constructor() {
        super(cartModel_1.default, "name");
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { cartName } = req.body;
            try {
                const data = yield cartModel_1.default.findByIdAndUpdate({ _id: id }, { cartName }, { new: true });
                if (data) {
                    res.status(200).send(data);
                }
                else {
                    res.status(404).send({ message: "Data not found" });
                }
            }
            catch (error) {
                res.status(500).send({ error });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { admin, cartName } = req.body;
            try {
                const data = new cartModel_1.default({ admin, productsIds: [], productsNames: [], productsAmounts: [], productsPrices: [], users: [], cartName });
                yield data.save();
                res.status(201).send(data);
            }
            catch (error) {
                res.status(500).send({ error });
            }
        });
    }
    addProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { productId, productName, price } = req.body;
            try {
                const cart = yield cartModel_1.default.findById({ _id: id });
                if (!cart) {
                    res.status(404).send({ message: "Cart not found" });
                }
                else {
                    for (let i = 0; i < cart.productsIds.length; i++) {
                        if (cart.productsIds[i] === productId) {
                            cart.productsAmounts[i] += 1;
                            cart.productsPrices[i] += price;
                            yield cart.save();
                            res.status(200).send(cart);
                            return;
                        }
                    }
                    cart.productsIds.push(productId);
                    cart.productsNames.push(productName);
                    cart.productsAmounts.push(1);
                    cart.productsPrices.push(price);
                    yield cart.save();
                    res.status(201).send(cart);
                }
            }
            catch (error) {
                res.status(500).send({ error });
            }
        });
    }
    removeProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { productId } = req.body;
            try {
                const cart = yield cartModel_1.default.findById({ _id: id });
                if (!cart) {
                    res.status(404).send({ message: "Cart not found" });
                }
                else {
                    for (let i = 0; i < cart.productsIds.length; i++) {
                        if (cart.productsIds[i] === productId) {
                            cart.productsIds.splice(i, 1);
                            cart.productsNames.splice(i, 1);
                            cart.productsAmounts.splice(i, 1);
                            cart.productsPrices.splice(i, 1);
                            yield cart.save();
                            res.status(200).send(cart);
                            return;
                        }
                    }
                    res.status(404).send({ message: "Product not found" });
                }
            }
            catch (error) {
                res.status(500).send({ error });
            }
        });
    }
    clearCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const cart = yield cartModel_1.default.findById({ _id: id });
                if (!cart) {
                    res.status(404).send({ message: "Cart not found" });
                }
                else {
                    cart.productsIds = [];
                    cart.productsNames = [];
                    cart.productsAmounts = [];
                    cart.productsPrices = [];
                    yield cart.save();
                    res.status(200).send(cart);
                }
            }
            catch (error) {
                res.status(500).send({ error });
            }
        });
    }
}
exports.default = new cartController();
//# sourceMappingURL=cartController.js.map