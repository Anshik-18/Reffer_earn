import mongoose from "mongoose";

const referralSchema = new mongoose.Schema({
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  referredId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "converted"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  convertedAt: { type: Date },
});

if (mongoose.models.Referral) {
  delete mongoose.models.Referral;
}



export const Referral = mongoose.models.Referral || mongoose.model("Referral", referralSchema);
