"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cartController_1 = __importDefault(require("../controllers/cartController"));
const express_1 = __importDefault(require("express"));
const cartRouter = express_1.default.Router();
cartRouter
    .get('/', cartController_1.default.getAll.bind(cartController_1.default))
    .post('/', cartController_1.default.create.bind(cartController_1.default))
    .get('/:id', cartController_1.default.getById.bind(cartController_1.default))
    .put('/:id', cartController_1.default.update.bind(cartController_1.default))
    .delete('/:id', cartController_1.default.deleteItem.bind(cartController_1.default))
    .post('/addProduct/:id', cartController_1.default.addProduct.bind(cartController_1.default))
    .post('/removeProduct/:id', cartController_1.default.removeProduct.bind(cartController_1.default))
    .put('/clearCart/:id', cartController_1.default.clearCart.bind(cartController_1.default));
exports.default = cartRouter;
//# sourceMappingURL=cartRoutes.js.map