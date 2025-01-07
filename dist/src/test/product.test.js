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
let app;
const categoryTest = {
    name: "Fruits"
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    yield productModel_1.default.deleteMany();
    yield categoryModel_1.default.deleteMany();
    const res = yield (0, supertest_1.default)(app).post('/categories').send(categoryTest);
    categoryTest._id = res.body._id;
    expect(res.status).toBe(201);
}));
const productTest = {
    name: "Apple",
    description: "This is an apple",
    price: 5,
    imageUrl: "https://www.google.com",
    category: categoryTest
};
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield productModel_1.default.deleteMany();
    yield categoryModel_1.default.deleteMany();
    yield mongoose_1.default.connection.close();
}));
let _id = "";
describe('Product tests', () => {
    test('Get products', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/products');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(0);
    }));
    test('Create product', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post('/products').send({
            name: productTest.name,
            description: productTest.description,
            price: productTest.price,
            imageUrl: productTest.imageUrl,
            category: productTest.category
        });
        _id = res.body._id;
        expect(res.status).toBe(201);
        expect(res.body.name).toBe(productTest.name);
        const res2 = yield (0, supertest_1.default)(app).get('/products');
        expect(res2.status).toBe(200);
        expect(res2.body.length).toBe(1);
    }));
    test('Create same product, fail', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post('/products').send({
            name: productTest.name,
            description: productTest.description,
            price: productTest.price,
            imageUrl: productTest.imageUrl,
            category: productTest.category
        });
        expect(res.status).not.toBe(201);
    }));
    test('Get product by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get(`/products/${_id}`);
        expect(res.status).toBe(200);
        expect(res.body.name).toBe(productTest.name);
    }));
    test('Get product by id, fail', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get(`/products/${_id} + 1`);
        expect(res.status).not.toBe(200);
    }));
    test('Get products by category', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get(`/products?filter=${categoryTest._id}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
    }));
    test('Update product', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).put(`/products/${_id}`).send({
            name: "Banana",
            description: "This is a banana",
            price: 3,
            imageUrl: "https://www.google.com",
            category: categoryTest
        });
        expect(res.status).toBe(200);
        expect(res.body.name).toBe("Banana");
    }));
    test('Update product, fail', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).put(`/products/${_id} + 1`).send({
            name: "Banana",
            description: "This is a banana",
            price: 3,
            imageUrl: "https://www.google.com",
            category: categoryTest
        });
        expect(res.status).not.toBe(200);
    }));
    test('Delete product', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).delete(`/products/${_id}`);
        expect(res.status).toBe(200);
        const res2 = yield (0, supertest_1.default)(app).get('/products');
        expect(res2.status).toBe(200);
        expect(res2.body.length).toBe(0);
    }));
    test('Update product fail', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).put(`/products/${_id}`).send({
            name: "Banana",
            description: "This is a banana",
            price: 3,
            imageUrl: "https://www.google.com",
            category: categoryTest
        });
        expect(res.status).not.toBe(200);
    }));
    test('Delete product, fail', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).delete(`/products/${_id}`);
        expect(res.status).not.toBe(200);
    }));
    test('Delete product, fail 500', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).delete(`/products/${_id} + 1`);
        expect(res.status).not.toBe(200);
    }));
});
//# sourceMappingURL=product.test.js.map