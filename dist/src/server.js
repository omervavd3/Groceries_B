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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
//routes
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
app.use('/products', productRoutes_1.default);
app.use('/categories', categoryRoutes_1.default);
app.use('/carts', cartRoutes_1.default);
app.use('/auth', authRoutes_1.default);
//mongoose connection
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/groceries';
const initApp = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        if (!MONGO_URL) {
            reject('Mongo URL is required');
        }
        else {
            mongoose_1.default
                .connect(MONGO_URL)
                .then(() => {
                console.log('Connected to MongoDB');
                resolve(app);
            })
                .catch((error) => {
                console.error({ error });
                reject('Error connecting to MongoDB');
            });
        }
    });
});
exports.default = initApp;
//# sourceMappingURL=server.js.map