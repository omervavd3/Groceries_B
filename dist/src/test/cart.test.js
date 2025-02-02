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
const userModel_1 = __importDefault(require("../models/userModel"));
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
const adminTest = {
    userName: "John",
    email: "john@email.com",
    password: "123456",
};
const userTest = {
    userName: "Jane",
    email: "jane@email.com",
    password: "1234"
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    yield productModel_1.default.deleteMany();
    yield categoryModel_1.default.deleteMany();
    yield cartModel_1.default.deleteMany();
    yield userModel_1.default.deleteMany();
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
    const res3 = yield (0, supertest_1.default)(app).post('/auth/register').send({
        userName: adminTest.userName,
        email: adminTest.email,
        password: adminTest.password
    });
    adminTest._id = res3.body._id;
    expect(res3.status).toBe(201);
    const res4 = yield (0, supertest_1.default)(app).post('/auth/login').send({
        email: adminTest.email,
        password: adminTest.password
    });
    adminTest.tokens = [];
    adminTest.tokens.push(res4.body.accessToken);
    expect(res4.status).toBe(200);
    expect(adminTest.tokens).toHaveLength(1);
    const res5 = yield (0, supertest_1.default)(app).post('/auth/register').send({
        userName: userTest.userName,
        email: userTest.email,
        password: userTest.password
    });
    userTest._id = res5.body._id;
    expect(res5.status).toBe(201);
    const res6 = yield (0, supertest_1.default)(app).post('/auth/login').send({
        email: userTest.email,
        password: userTest.password
    });
    userTest.tokens = [];
    userTest.tokens.push(res6.body.accessToken);
    expect(res6.status).toBe(200);
    expect(userTest.tokens).toHaveLength(1);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield productModel_1.default.deleteMany();
    yield categoryModel_1.default.deleteMany();
    yield cartModel_1.default.deleteMany();
    yield userModel_1.default.deleteMany();
    yield mongoose_1.default.connection.close();
}));
let _id = "";
describe('Cart tests', () => {
    test('Create cart', () => __awaiter(void 0, void 0, void 0, function* () {
        if (adminTest.tokens === undefined) {
            throw new Error('User not logged in');
        }
        const res = yield (0, supertest_1.default)(app).post('/carts').set({
            Authorization: `JWT ${adminTest.tokens[0]}`
        }).send({
            cartName: "Cart 1"
        });
        expect(res.status).toBe(201);
        expect(res.body.users).toHaveLength(1);
        _id = res.body._id;
    }));
    test('Create cart without token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post('/carts').send({
            cartName: "Cart 2"
        });
        expect(res.status).not.toBe(200);
    }));
    test('Create cart with invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
        if (adminTest.tokens === undefined) {
            throw new Error('User not logged in');
        }
        const res = yield (0, supertest_1.default)(app).post('/carts').set({
            Authorization: `JWT ${adminTest.tokens[0]}1`
        }).send({
            cartName: "Cart 3"
        });
        expect(res.status).not.toBe(200);
    }));
    test('Create cart with invalid adminId', () => __awaiter(void 0, void 0, void 0, function* () {
        if (adminTest.tokens === undefined) {
            throw new Error('User not logged in');
        }
        const res = yield (0, supertest_1.default)(app).post('/carts').set({
            Authorization: `JWT ${adminTest.tokens[0]}`
        }).send({
            cartName: "Cart 4"
        });
        expect(res.status).not.toBe(200);
    }));
    test('Add product to cart', () => __awaiter(void 0, void 0, void 0, function* () {
        if (adminTest.tokens === undefined) {
            throw new Error('User not logged in');
        }
        const res = yield (0, supertest_1.default)(app).post(`/carts/addProduct/${_id}`).set({
            Authorization: `JWT ${adminTest.tokens[0]}`
        }).send({
            productId: productTest._id,
            productName: productTest.name,
            producPrice: productTest.price
        });
        expect(res.status).toBe(201);
        expect(res.body.productsIds).toHaveLength(1);
        const res2 = yield (0, supertest_1.default)(app).post(`/carts/addProduct/${_id}`).set({
            Authorization: `JWT ${adminTest.tokens[0]}`
        }).send({
            productId: productTest._id,
            productName: productTest.name,
            producPrice: productTest.price
        });
        expect(res2.status).toBe(200);
        expect(res2.body.productsIds).toHaveLength(1);
    }));
    test('Add product to cart without token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post(`/carts/addProduct/${_id}`).send({
            productId: productTest._id,
            productName: productTest.name,
            producPrice: productTest.price
        });
        expect(res.status).not.toBe(200);
    }));
    test('Add a second product to cart', () => __awaiter(void 0, void 0, void 0, function* () {
        if (adminTest.tokens === undefined) {
            throw new Error('User not logged in');
        }
        const res = yield (0, supertest_1.default)(app).post(`/carts/addProduct/${_id}`).set({
            Authorization: `JWT ${adminTest.tokens[0]}`
        }).send({
            productId: productTest2._id,
            productName: productTest2.name,
            producPrice: productTest2.price
        });
        expect(res.status).toBe(201);
        expect(res.body.productsIds).toHaveLength(2);
    }));
    test('Remove product from cart', () => __awaiter(void 0, void 0, void 0, function* () {
        if (adminTest.tokens === undefined) {
            throw new Error('User not logged in');
        }
        const res = yield (0, supertest_1.default)(app).post(`/carts/removeProduct/${_id}`).set({
            Authorization: `JWT ${adminTest.tokens[0]}`
        }).send({
            productId: productTest._id
        });
        expect(res.status).toBe(200);
        expect(res.body.productsIds).toHaveLength(1);
    }));
    test('Remove product from cart without token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post(`/carts/removeProduct/${_id}`).send({
            productId: productTest2._id
        });
        expect(res.status).not.toBe(200);
    }));
    test('Remove product from cart with invalid product id', () => __awaiter(void 0, void 0, void 0, function* () {
        if (adminTest.tokens === undefined) {
            throw new Error('User not logged in');
        }
        const res = yield (0, supertest_1.default)(app).post(`/carts/removeProduct/${_id}`).set({
            Authorization: `JWT ${adminTest.tokens[0]}`
        }).send({
            productId: productTest2._id + "1"
        });
        expect(res.status).not.toBe(200);
    }));
    test('Add user to cart', () => __awaiter(void 0, void 0, void 0, function* () {
        if (adminTest.tokens === undefined) {
            throw new Error('User not logged in');
        }
        const res = yield (0, supertest_1.default)(app).post(`/carts/addUser/${_id}`).set({
            Authorization: `JWT ${adminTest.tokens[0]}`
        }).send({
            userId: userTest._id,
        });
        expect(res.status).toBe(200);
        expect(res.body.users).toHaveLength(2);
    }));
    test('Add same user again', () => __awaiter(void 0, void 0, void 0, function* () {
        if (adminTest.tokens === undefined) {
            throw new Error('User not logged in');
        }
        const res = yield (0, supertest_1.default)(app).post(`/carts/addUser/${_id}`).set({
            Authorization: `JWT ${adminTest.tokens[0]}`
        }).send({
            userId: userTest._id,
        });
        expect(res.status).not.toBe(200);
    }));
    test('Other user add product to cart', () => __awaiter(void 0, void 0, void 0, function* () {
        if (userTest.tokens === undefined) {
            throw new Error('User not logged in');
        }
        const res = yield (0, supertest_1.default)(app).post(`/carts/addProduct/${_id}`).set({
            Authorization: `JWT ${userTest.tokens[0]}`
        }).send({
            productId: productTest._id,
            productName: productTest.name,
            producPrice: productTest.price
        });
        expect(res.status).toBe(201);
        expect(res.body.productsIds).toHaveLength(2);
    }));
    test('User try to remove admin from cart', () => __awaiter(void 0, void 0, void 0, function* () {
        if (userTest.tokens === undefined) {
            throw new Error('User not logged in');
        }
        const res = yield (0, supertest_1.default)(app).post(`/carts/removeUser/${_id}`).set({
            Authorization: `JWT ${userTest.tokens[0]}`
        }).send({
            userId: adminTest._id,
        });
        expect(res.status).not.toBe(200);
    }));
    test('Admin remove user from cart', () => __awaiter(void 0, void 0, void 0, function* () {
        if (adminTest.tokens === undefined) {
            throw new Error('User not logged in');
        }
        const res = yield (0, supertest_1.default)(app).post(`/carts/removeUser/${_id}`).set({
            Authorization: `JWT ${adminTest.tokens[0]}`
        }).send({
            userId: userTest._id,
        });
        expect(res.status).toBe(200);
        expect(res.body.users).toHaveLength(1);
    }));
    test('Clear cart', () => __awaiter(void 0, void 0, void 0, function* () {
        if (adminTest.tokens === undefined) {
            throw new Error('User not logged in');
        }
        const res = yield (0, supertest_1.default)(app).put(`/carts/clearCart/${_id}`).set({
            Authorization: `JWT ${adminTest.tokens[0]}`
        });
        expect(res.status).toBe(200);
        expect(res.body.productsIds).toHaveLength(0);
    }));
    test('Delete cart without token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).delete(`/carts/${_id}`);
        expect(res.status).not.toBe(200);
    }));
    test('Delete cart with invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
        if (adminTest.tokens === undefined) {
            throw new Error('User not logged in');
        }
        const res = yield (0, supertest_1.default)(app).delete(`/carts/${_id}`).set({
            Authorization: `JWT ${adminTest.tokens[0]}1`
        });
        expect(res.status).not.toBe(200);
    }));
    test('Delete cart', () => __awaiter(void 0, void 0, void 0, function* () {
        if (adminTest.tokens === undefined) {
            throw new Error('User not logged in');
        }
        const res = yield (0, supertest_1.default)(app).delete(`/carts/${_id}`).set({
            Authorization: `JWT ${adminTest.tokens[0]}`
        });
        expect(res.status).toBe(200);
    }));
});
//# sourceMappingURL=cart.test.js.map