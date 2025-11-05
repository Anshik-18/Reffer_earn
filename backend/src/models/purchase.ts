import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  isFirstPurchase: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});


export const Purchase =mongoose.models.Purchase || mongoose.model("purchase", purchaseSchema);