import express, { Request, Response } from "express";
import { Purchase } from "../models/purchase";
import { User_schema } from "../models/user";
import { Referral } from "../models/refferal";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const userSchema = new mongoose.Schema<IUser>({
  name: String,
  email: { type: String, unique: true },
  password: String,
  referralCode: { type: String, unique: true },
  referredBy: String,
  credits: { type: Number, default: 0 },
});


interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  referralCode: string;
  referredBy?: string;
  credits: number;
}

const User = mongoose.model<IUser>("User", userSchema);

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, refferalcode: referredBy } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const referralCode =
      name.slice(0, 3).toUpperCase() + Math.floor(Math.random() * 10000);

    const newUser = await User.create({
      name,
      email,
      password: hash,
      referralCode,
      referredBy,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });
    if(referredBy){
      const user  = await User_schema.findOne({referralCode:referredBy});
      if(user){
        const reffere_id = user._id

        const reffer = await Referral.create({referrerId:reffere_id,referredId:newUser._id}) 
      }
    }

    res.json({ success: true, user: newUser, token });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    res.json({ success: true, user, token });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});



export default router;