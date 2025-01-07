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
var app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    yield productModel_1.default.deleteMany();
    yield categoryModel_1.default.deleteMany();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield productModel_1.default.deleteMany();
    yield categoryModel_1.default.deleteMany();
    yield mongoose_1.default.connection.close();
}));
let _id = "";
describe('Category tests', () => {
    test('Get categories', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/categories');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(0);
    }));
    test('Create category', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post('/categories').send({
            name: "Fruits"
        });
        expect(res.status).toBe(201);
        expect(res.body.name).toBe("Fruits");
        _id = res.body._id;
        const res2 = yield (0, supertest_1.default)(app).get('/categories');
        expect(res2.status).toBe(200);
        expect(res2.body.length).toBe(1);
    }));
    test('Create category with existing name', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post('/categories').send({
            name: "Fruits"
        });
        expect(res.status).not.toBe(201);
    }));
    test('Get category by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get(`/categories/${_id}`);
        expect(res.status).toBe(200);
        expect(res.body.name).toBe("Fruits");
    }));
    test('Get category by invalid id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get(`/categories/123`);
        expect(res.status).not.toBe(200);
    }));
    test('Update category', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).put(`/categories/${_id}`).send({
            name: "Vegetables"
        });
        expect(res.status).toBe(200);
        expect(res.body.name).toBe("Vegetables");
    }));
    test('Update category with false id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).put(`/categories/123`).send({
            name: "Vegetables"
        });
        expect(res.status).not.toBe(200);
    }));
    test('Get category by filter', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get(`/categories?filter=Vegetables`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        const res2 = yield (0, supertest_1.default)(app).get(`/categories?filter=Fruits`);
        expect(res2.status).toBe(200);
        expect(res2.body.length).toBe(0);
    }));
    test('Delete category', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).delete(`/categories/${_id}`);
        expect(res.status).toBe(200);
        const res2 = yield (0, supertest_1.default)(app).get(`/categories`);
        expect(res2.status).toBe(200);
        expect(res2.body.length).toBe(0);
    }));
});
//# sourceMappingURL=category.test.js.map