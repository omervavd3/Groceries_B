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
const userModel_1 = __importDefault(require("../models/userModel"));
var app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("beforeAll");
    app = yield (0, server_1.default)();
    yield userModel_1.default.deleteOne({ email: testUser.email });
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("afterAll");
    yield userModel_1.default.deleteOne({ email: testUser.email });
    mongoose_1.default.connection.close();
}));
const testUser = {
    email: "test@example.com",
    password: "1234",
    userName: "test name",
};
describe("User Tests", () => {
    test("Auth test register", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send({
            email: testUser.email,
            password: testUser.password,
            userName: testUser.userName,
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.password).not.toBe(testUser.password);
    }));
    test("Auth test register with the same email again", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send({
            email: testUser.email,
            password: testUser.password,
            userName: testUser.userName,
        });
        expect(response.statusCode).not.toBe(200);
    }));
    test("Auth test register without email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send({
            password: testUser.password,
        });
        expect(response.statusCode).not.toBe(200);
    }));
    test("Auth test login", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send({
            email: testUser.email,
            password: testUser.password,
        });
        expect(response.statusCode).toBe(200);
        const accessToken = response.body.accessToken;
        const refreshToken = response.body.refreshToken;
        testUser.accessToken = accessToken;
        testUser.refreshToken = refreshToken;
        expect(testUser.accessToken).not.toBeNull();
        expect(testUser.refreshToken).not.toBeNull();
    }));
    test("Auth test login with wrong password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send({
            email: testUser.email,
            password: "wrongPassword",
        });
        expect(response.statusCode).not.toBe(200);
    }));
    test("Auth test login without email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send({
            password: testUser.password,
        });
        expect(response.statusCode).not.toBe(200);
    }));
    test("Auth test with wrong email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send({
            email: "wrongEmail",
            password: testUser.password,
        });
        expect(response.statusCode).not.toBe(200);
    }));
    test("Auth test refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/refresh").set({
            Authorization: `JWT ${testUser.refreshToken}`
        });
        expect(response.statusCode).toBe(200);
        testUser.accessToken = response.body.accessToken;
        testUser.refreshToken = response.body.refreshToken;
    }));
    test("Auth test refresh token without token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/refresh").set({});
        expect(response.statusCode).toBe(401);
    }));
    test("Auth test refresh token with wrong token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/refresh").set({
            Authorization: `JWT wrongToken`
        });
        expect(response.statusCode).toBe(403);
    }));
    test("Auth test double use of refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/refresh").set({
            Authorization: `JWT ${testUser.refreshToken}`
        });
        expect(response.statusCode).toBe(200);
        const response2 = yield (0, supertest_1.default)(app).post("/auth/refresh").set({
            Authorization: `JWT ${testUser.refreshToken}`
        });
        expect(response2.statusCode).toBe(200);
        const newRefreshToken = response.body.refreshToken;
        testUser.refreshToken = newRefreshToken;
    }));
    test("Auth test logout", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/logout").set({
            Authorization: `JWT ${testUser.refreshToken}`
        });
        expect(response.statusCode).toBe(200);
    }));
    test("Auth test logout without token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/logout").set({});
        expect(response.statusCode).toBe(401);
    }));
    test("Auth test logout with wrong token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/logout").set({
            Authorization: `JWT wrongToken`
        });
        expect(response.statusCode).toBe(403);
    }));
});
//# sourceMappingURL=auth.test.js.map