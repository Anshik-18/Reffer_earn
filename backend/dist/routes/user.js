"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../models/user");
const refferal_1 = require("../models/refferal");
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const userSchema = new mongoose_1.default.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    referralCode: { type: String, unique: true },
    referredBy: String,
    credits: { type: Number, default: 0 },
});
const User = mongoose_1.default.model("User", userSchema);
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, refferalcode: referredBy } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: "All fields required" });
        const existing = await User.findOne({ email });
        if (existing)
            return res.status(400).json({ message: "User already exists" });
        const hash = await bcrypt_1.default.hash(password, 10);
        const referralCode = name.slice(0, 3).toUpperCase() + Math.floor(Math.random() * 10000);
        const newUser = await User.create({
            name,
            email,
            password: hash,
            referralCode,
            referredBy,
        });
        const token = jsonwebtoken_1.default.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        if (referredBy) {
            const user = await user_1.User_schema.findOne({ referralCode: referredBy });
            if (user) {
                const reffere_id = user._id;
                const reffer = await refferal_1.Referral.create({ referrerId: reffere_id, referredId: newUser._id });
            }
        }
        res.json({ success: true, user: newUser, token });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match)
            return res.status(400).json({ message: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.json({ success: true, user, token });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.default = router;
