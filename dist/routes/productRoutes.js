"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//router for product routes
const productController_1 = __importDefault(require("../controllers/productController"));
const express_1 = __importDefault(require("express"));
const productRouter = express_1.default.Router();
productRouter
    .get('/', productController_1.default.getAll.bind(productController_1.default))
    .post('/', productController_1.default.create.bind(productController_1.default))
    .get('/:id', productController_1.default.getById.bind(productController_1.default))
    .put('/:id', productController_1.default.update.bind(productController_1.default))
    .delete('/:id', productController_1.default.deleteItem.bind(productController_1.default));
exports.default = productRouter;
//# sourceMappingURL=productRoutes.js.map