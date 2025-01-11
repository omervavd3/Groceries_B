"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    tokens: {
        type: [String],
        default: []
    },
    cartTokens: {
        type: [String],
        default: []
    }
});
exports.default = mongoose_1.default.model('UserModel', UserSchema);
//# sourceMappingURL=userModel.js.map