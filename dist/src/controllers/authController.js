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
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, userName } = req.body;
    try {
        const user = yield userModel_1.default.findOne({ email });
        if (user) {
            res.status(400).send({ message: "User already exists" });
            return;
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = new userModel_1.default({ email, password: hashPassword, userName });
        yield newUser.save();
        res.status(201).send(newUser);
    }
    catch (error) {
        res.status(500).send({ error });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield userModel_1.default.findOne({ email: email });
        if (!user) {
            res.status(404).send({ message: "User not found" });
            return;
        }
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            res.status(400).send({ message: "Invalid password" });
            return;
        }
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
        if (refreshTokenSecret == null || accessTokenSecret == null || jwtExpiresIn == null) {
            res.status(500).send({ message: "No secret token" });
            return;
        }
        const mathRandom = Math.random().toString();
        const accessToken = yield jsonwebtoken_1.default.sign({
            _id: user._id,
            random: mathRandom,
        }, accessTokenSecret, { expiresIn: jwtExpiresIn });
        const refreshToken = yield jsonwebtoken_1.default.sign({
            _id: user._id,
            random: mathRandom,
        }, refreshTokenSecret, { expiresIn: jwtExpiresIn });
        if (user.tokens == null) {
            user.tokens = [];
        }
        user.tokens.push(refreshToken);
        yield user.save();
        res
            .status(200)
            .send({ accessToken: accessToken, refreshToken: refreshToken });
    }
    catch (error) {
        res.status(500).send({ error });
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authToken = req.headers["authorization"];
        const refreshToken = authToken && authToken.split(" ")[1];
        if (refreshToken == null) {
            res.status(401).send("Unauthorized");
            return;
        }
        if (process.env.REFRESH_TOKEN_SECRET == null) {
            res.status(500).send("Internal server error");
            return;
        }
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.status(403).send("Error");
                return;
            }
            const user = yield userModel_1.default.findById(payload._id);
            if (user == null) {
                res.status(403).send("User is null");
                return;
            }
            if (!user.tokens.includes(refreshToken)) {
                user.tokens = [];
                yield user.save();
                res.status(403).send("No matching token");
                return;
            }
            user.tokens = user.tokens.filter((token) => token !== refreshToken);
            yield user.save();
            res.status(200).send("Logged out");
        }));
    }
    catch (error) {
        res.status(500).send(error);
    }
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = req.headers["authorization"];
    const refreshToken = authToken && authToken.split(" ")[1];
    if (refreshToken == null) {
        res.status(401).send("Unauthorized");
        return;
    }
    try {
        if (process.env.REFRESH_TOKEN_SECRET == null) {
            res.status(500).send("Internal server error");
            return;
        }
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.status(403).send("Wrong refresh token");
                return;
            }
            const user = yield userModel_1.default.findById(payload._id);
            if (user == null) {
                res.status(403).send("Forbidden");
                return;
            }
            if (user.tokens == null) {
                res.status(403).send("Forbidden");
                return;
            }
            if (!user.tokens.includes(refreshToken)) {
                user.tokens = [];
                yield user.save();
                res.status(403).send("Forbidden");
                return;
            }
            if (process.env.ACCESS_TOKEN_SECRET == null ||
                process.env.JWT_EXPIRES_IN == null ||
                process.env.REFRESH_TOKEN_SECRET == null) {
                res.status(500).send("Internal server error");
                return;
            }
            const random = Math.random().toString();
            const accesToken = yield jsonwebtoken_1.default.sign({
                _id: user._id,
                random: random,
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
            const newRefreshToken = yield jsonwebtoken_1.default.sign({
                _id: user._id,
                random: random,
            }, process.env.REFRESH_TOKEN_SECRET);
            user.tokens.push(newRefreshToken);
            yield user.save();
            res
                .status(200)
                .send({ accessToken: accesToken, refreshToken: newRefreshToken });
        }));
    }
    catch (error) {
        res.status(500).send(error);
    }
});
const autMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeaders = req.headers["authorization"];
    const token = authHeaders && authHeaders.split(" ")[1];
    if (token == null) {
        res.status(401).send("No token provided");
        return;
    }
    if (process.env.ACCESS_TOKEN_SECRET == null) {
        res.status(500).send("No token secret");
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            res.status(403).send("Error in middleware");
            return;
        }
        req.params.userId = payload._id;
        next();
    });
});
exports.default = { register, login, logout, refresh, autMiddleware };
//# sourceMappingURL=authController.js.map