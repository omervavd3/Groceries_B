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
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const baseController_1 = __importDefault(require("./baseController"));
class categoryController extends baseController_1.default {
    constructor() {
        super(categoryModel_1.default, "name");
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { name } = req.body;
            try {
                const data = yield this.model.findByIdAndUpdate({ _id: id }, { name }, { new: true });
                if (data) {
                    res.status(200).send(data);
                }
                else {
                    res.status(404).send({ message: "Data not found" });
                }
            }
            catch (error) {
                res.status(500).send({ error });
            }
        });
    }
}
exports.default = new categoryController();
//# sourceMappingURL=categoryController.js.map