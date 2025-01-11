"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authController_1 = __importDefault(require("../controllers/authController"));
const express_1 = __importDefault(require("express"));
const authRouter = express_1.default.Router();
authRouter
    .post('/register', authController_1.default.register.bind(authController_1.default))
    .post('/login', authController_1.default.login.bind(authController_1.default))
    .post('/logout', authController_1.default.logout.bind(authController_1.default))
    .post('/refresh', authController_1.default.refresh.bind(authController_1.default));
exports.default = authRouter;
//# sourceMappingURL=authRoutes.js.map