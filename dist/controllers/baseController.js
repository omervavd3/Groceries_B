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
Object.defineProperty(exports, "__esModule", { value: true });
class BaseController {
    constructor(model, filter) {
        this.model = model;
        this.filter = filter;
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = req.query.filter;
            try {
                if (filter) {
                    const data = yield this.model.find({ [this.filter]: filter });
                    res.status(200).send(data);
                }
                else {
                    const data = yield this.model.find();
                    res.status(200).send(data);
                }
            }
            catch (error) {
                res.status(500).send({ error });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = new this.model(req.body);
                yield data.save();
                res.status(201).send(data);
            }
            catch (error) {
                res.status(500).send({ error });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const data = yield this.model.findById({ _id: id });
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
    deleteItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const data = yield this.model.findByIdAndDelete({ _id: id });
                if (data) {
                    res.status(200).send({ message: "Data deleted" });
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
exports.default = BaseController;
//# sourceMappingURL=baseController.js.map