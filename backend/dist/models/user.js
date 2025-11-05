"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User_schema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    referralCode: { type: String, unique: true },
    referredBy: String,
    credits: { type: Number, default: 0 },
});
exports.User_schema = mongoose_1.default.models.Purchase || mongoose_1.default.model("user", userSchema);
