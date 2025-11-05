"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Referral = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const referralSchema = new mongoose_1.default.Schema({
    referrerId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    referredId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "converted"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
    convertedAt: { type: Date },
});
if (mongoose_1.default.models.Referral) {
    delete mongoose_1.default.models.Referral;
}
exports.Referral = mongoose_1.default.models.Referral || mongoose_1.default.model("Referral", referralSchema);
