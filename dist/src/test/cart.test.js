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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const productModel_1 = __importDefault(require("../models/productModel"));
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
var app;
const categoryTest = {
    name: "Fruits"
};
const productTest = {
    name: "Apple",
    description: "This is an apple",
    price: 5,
    imageUrl: "https://www.google.com",
    category: categoryTest
};
const productTest2 = {
    name: "Banana",
    description: "This is a banana",
    price: 3,
    imageUrl: "https://www.google.com",
    category: categoryTest
};
const userTest = {
    name: "John",
    email: "john@email.com",
    password: "123456"
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    yield productModel_1.default.deleteMany();
    yield categoryModel_1.default.deleteMany();
    yield cartModel_1.default.deleteMany();
    const res = yield (0, supertest_1.default)(app).post('/categories').send({
        name: categoryTest.name
    });
    categoryTest._id = res.body._id;
    expect(res.status).toBe(201);
    const res2 = yield (0, supertest_1.default)(app).post('/products').send({
        name: productTest.name,
        description: productTest.description,
        price: productTest.price,
        imageUrl: productTest.imageUrl,
        category: categoryTest
    });
    productTest._id = res2.body._id;
    expect(res2.status).toBe(201);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield productModel_1.default.deleteMany();
    yield categoryModel_1.default.deleteMany();
    yield cartModel_1.default.deleteMany();
    yield mongoose_1.default.connection.close();
}));
let _id = "";
describe('Cart tests', () => {
    test('Get carts', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/carts');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(0);
    }));
    test('Create cart', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post('/carts').send({
            admin: userTest.name,
            cartName: "Cart 1"
        });
        _id = res.body._id;
        expect(res.status).toBe(201);
    }));
    test('Add product to cart', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post(`/carts/addProduct/${_id}`).send({
            productId: productTest._id,
            productName: productTest.name,
            price: productTest.price
        });
        expect(res.status).toBe(201);
        expect(res.body.productsIds.length).toBe(1);
        expect(res.body.productsAmounts.length).toBe(1);
        expect(res.body.productsPrices.length).toBe(1);
        const res2 = yield (0, supertest_1.default)(app).post(`/carts/addProduct/${_id}`).send({
            productId: productTest._id,
            productName: productTest.name,
            price: productTest.price
        });
        expect(res2.body.productsIds.length).toBe(1);
        expect(res2.body.productsAmounts.length).toBe(1);
        expect(res2.body.productsPrices.length).toBe(1);
        const res3 = yield (0, supertest_1.default)(app).post(`/carts/addProduct/${_id}`).send({
            productId: productTest2._id,
            productName: productTest2.name,
            price: productTest2.price
        });
        expect(res3.body.productsIds.length).toBe(2);
        expect(res3.body.productsAmounts.length).toBe(2);
        expect(res3.body.productsPrices.length).toBe(2);
    }));
    test('Add product to cart with wrong id, fail', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post(`/carts/addProduct/${_id} + 1`).send({
            productId: productTest._id,
            productName: productTest.name,
            price: productTest.price
        });
        expect(res.status).not.toBe(201);
    }));
    test('Update cart', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).put(`/carts/${_id}`).send({
            cartName: "Cart 2"
        });
        expect(res.status).toBe(200);
        expect(res.body.cartName).toBe("Cart 2");
    }));
    test('Update cart with wrong id, fail', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).put(`/carts/${_id} + 1`).send({
            cartName: "Cart 2"
        });
        expect(res.status).not.toBe(200);
    }));
    test('Remove product from cart', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post(`/carts/removeProduct/${_id}`).send({
            productId: productTest._id
        });
        expect(res.status).toBe(200);
        expect(res.body.productsIds.length).toBe(1);
        expect(res.body.productsAmounts.length).toBe(1);
        expect(res.body.productsPrices.length).toBe(1);
    }));
    test('Remove product from cart with wrong id, fail', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post(`/carts/removeProduct/${_id} + 1`).send({
            productId: productTest._id
        });
        expect(res.status).not.toBe(200);
    }));
    test('Clear cart', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).put(`/carts/clearCart/${_id}`);
        expect(res.status).toBe(200);
        expect(res.body.productsIds.length).toBe(0);
        expect(res.body.productsAmounts.length).toBe(0);
        expect(res.body.productsPrices.length).toBe(0);
    }));
    test('Clear cart with wrong id, fail', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).put(`/carts/clearCart/${_id} + 1`);
        expect(res.status).not.toBe(200);
    }));
});
//# sourceMappingURL=cart.test.js.map