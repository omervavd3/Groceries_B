import mongoose from 'mongoose';

export interface IUser {
    _id?: string;
    userName: string;
    password: string;
    email: string;
    tokens?: string[];
    cartTokens?: string[];
}

const UserSchema = new mongoose.Schema({
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
})

export default mongoose.model('UserModel', UserSchema);