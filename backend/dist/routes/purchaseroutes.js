"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const purchase_1 = require("../models/purchase");
const user_1 = require("../models/user");
const refferal_1 = require("../models/refferal");
const router = express_1.default.Router();
router.post("/", async (req, res) => {
    try {
        const amount = "42";
        const { userId } = req.body;
        // Create purchase
        const purchase = await purchase_1.Purchase.create({ userId, amount });
        // Check first purchase
        const totalPurchases = await purchase_1.Purchase.countDocuments({ userId });
        console.log(totalPurchases);
        const isFirstPurchase = totalPurchases <= 1;
        console.log(isFirstPurchase);
        if (isFirstPurchase) {
            await purchase_1.Purchase.updateOne({ userId }, { $set: { isFirstPurchase: true } });
            await user_1.User_schema.findByIdAndUpdate(userId, { $inc: { credits: 2 } });
            // Handle referral conversion
            const referral = await refferal_1.Referral.findOne({ referredId: userId });
            if (referral) {
                referral.status = "converted";
                referral.convertedAt = new Date();
                await referral.save();
                await user_1.User_schema.findByIdAndUpdate(referral.referrerId, { $inc: { credits: 2 } });
            }
        }
        res.json({ success: true, purchase });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.default = router;
