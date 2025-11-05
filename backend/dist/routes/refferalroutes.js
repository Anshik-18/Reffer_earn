"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../models/user");
const refferal_1 = require("../models/refferal");
const router = express_1.default.Router();
// get the refferal code 
router.post("/", async (req, res) => {
    try {
        const { userId, referralCode } = req.body;
        const user = await user_1.User_schema.findOne({ referralCode });
        if (user) {
            const referrerId = user?.id;
            const referredId = userId;
            const refferal = await refferal_1.Referral.create({ referrerId, referredId });
            res.status(201).json({ success: true });
        }
        else {
            res.status(500).json({ message: "Invalid refferal code" });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// create a reffer 
router.post("/code", async (req, res) => {
    try {
        const { userId, amount } = req.body;
        const user = await user_1.User_schema.findOne({ userId });
        const refferalcode = user?.referralCode;
        res.status(201).json({ refferalcode });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.default = router;
