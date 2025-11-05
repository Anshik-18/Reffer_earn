"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../models/user");
const refferal_1 = require("../models/refferal");
const router = express_1.default.Router();
router.post("/info", async (req, res) => {
    try {
        console.log("body", req.body);
        const { _id } = req.body;
        const user = await user_1.User_schema.findById({ _id });
        if (user) {
            const name = user?.name;
            const refferalcode = user.referralCode;
            const total_reffered = await refferal_1.Referral.countDocuments({ referrerId: _id });
            const converted_refferd = await refferal_1.Referral.countDocuments({ referrerId: _id, status: "converted" });
            const credits = user?.credits;
            res.status(201).json({ refferalcode, name, credits, total_reffered, converted_refferd });
        }
        else {
            res.status(500).json({ message: "USer not found" });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.default = router;
