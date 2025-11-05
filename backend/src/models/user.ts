import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  referralCode: { type: String, unique: true },
  referredBy: String,
  credits: { type: Number, default: 0 },
});

export const User_schema =mongoose.models.Purchase || mongoose.model("user", userSchema);
