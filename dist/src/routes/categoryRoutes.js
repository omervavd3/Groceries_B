"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = __importDefault(require("../controllers/categoryController"));
const categoryRouter = express_1.default.Router();
categoryRouter
    .get('/', categoryController_1.default.getAll.bind(categoryController_1.default))
    .post('/', categoryController_1.default.create.bind(categoryController_1.default))
    .get('/:id', categoryController_1.default.getById.bind(categoryController_1.default))
    .put('/:id', categoryController_1.default.update.bind(categoryController_1.default))
    .delete('/:id', categoryController_1.default.deleteItem.bind(categoryController_1.default));
exports.default = categoryRouter;
//# sourceMappingURL=categoryRoutes.js.map