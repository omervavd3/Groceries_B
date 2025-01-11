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
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../models/userModel"));
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
            const { adminId, cartName } = req.body;
            try {
                const user = yield userModel_1.default.findById({ _id: adminId });
                if (!user) {
                    res.status(404).send({ message: "User not found" });
                    return;
                }
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashAdmin = yield bcrypt_1.default.hash(adminId, salt);
                const data = new cartModel_1.default({
                    admin: hashAdmin,
                    productsIds: [],
                    productsNames: [],
                    productsAmounts: [],
                    productsPrices: [],
                    users: [],
                    cartName: cartName,
                });
                data.users.push(hashAdmin);
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
            const { productId, productName, producPrice } = req.body;
            try {
                const cart = yield cartModel_1.default.findById({ _id: id });
                if (!cart) {
                    res.status(404).send({ message: "Cart not found" });
                }
                else {
                    for (let i = 0; i < cart.productsIds.length; i++) {
                        if (cart.productsIds[i] === productId) {
                            cart.productsAmounts[i] += 1;
                            cart.productsPrices[i] += producPrice;
                            yield cart.save();
                            res.status(200).send(cart);
                            return;
                        }
                    }
                    cart.productsIds.push(productId);
                    cart.productsNames.push(productName);
                    cart.productsAmounts.push(1);
                    cart.productsPrices.push(producPrice);
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
    addUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { userId } = req.body;
            try {
                const cart = yield cartModel_1.default.findById({ _id: id });
                if (!cart) {
                    res.status(404).send({ message: "Cart not found" });
                }
                else {
                    const userInCart = yield cart.users.find((user) => bcrypt_1.default.compare(userId, user._id));
                    if (userInCart) {
                        res.status(400).send({ message: "User already in cart" });
                        return;
                    }
                    const salt = yield bcrypt_1.default.genSalt(10);
                    const userHash = yield bcrypt_1.default.hash(userId, salt);
                    cart.users.push(userHash);
                    yield cart.save();
                    res.status(200).send(cart);
                }
            }
            catch (error) {
                res.status(500).send({ error });
            }
        });
    }
    removeUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { userId } = req.body;
            try {
                const cart = yield cartModel_1.default.findById({ _id: id });
                if (!cart) {
                    res.status(404).send({ message: "Cart not found" });
                }
                else {
                    const userInCart = yield cart.users.find((user) => bcrypt_1.default.compare(userId, user._id));
                    if (!userInCart) {
                        res.status(400).send({ message: "User not in cart" });
                        return;
                    }
                    cart.users.splice(cart.users.indexOf(userInCart), 1);
                    yield cart.save();
                    res.status(200).send(cart);
                }
            }
            catch (error) {
                res.status(500).send({ error });
            }
        });
    }
    adminMiddleware(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminId = req.body.adminId;
            const cartId = req.params.id;
            if (!adminId) {
                res.status(400).send({ message: "No admin id" });
                return;
            }
            const cart = yield cartModel_1.default.findById({ _id: cartId });
            if (!cart) {
                res.status(404).send({ message: "Cart not found" });
                return;
            }
            const validId = yield bcrypt_1.default.compare(adminId, cart.admin);
            if (!validId) {
                res.status(400).send({ message: "Invalid admin id" });
                return;
            }
            next();
        });
    }
    userMiddleware(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.body.userId;
            const cartId = req.params.id;
            if (!userId) {
                res.status(400).send({ message: "No user id" });
                return;
            }
            const cart = yield cartModel_1.default.findById({ _id: cartId });
            if (!cart) {
                res.status(404).send({ message: "Cart not found" });
                return;
            }
            const cartUsers = cart.users;
            for (let i = 0; i < cartUsers.length; i++) {
                const validId = yield bcrypt_1.default.compare(userId, cartUsers[i]);
                if (validId) {
                    next();
                    return;
                }
            }
            res.status(400).send({ message: "Invalid user id" });
            return;
        });
    }
}
exports.default = new cartController();
//# sourceMappingURL=cartController.js.map