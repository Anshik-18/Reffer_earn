import express, { Request, Response } from "express";
import { Purchase } from "../models/purchase";
import { User_schema } from "../models/user";
import { Referral } from "../models/refferal";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const amount = "42"
    const { userId } = req.body;

    // Create purchase
    const purchase = await Purchase.create({ userId, amount });

    // Check first purchase
    const totalPurchases = await Purchase.countDocuments({ userId });
    console.log(totalPurchases)
    const isFirstPurchase = totalPurchases <= 1;
    console.log(isFirstPurchase)
    if (isFirstPurchase) {
      
       await Purchase.updateOne({userId},{$set :{isFirstPurchase:true}})
      await User_schema.findByIdAndUpdate(userId, { $inc: { credits: 2 } });

      // Handle referral conversion
      const referral = await Referral.findOne({ referredId: userId });
      if (referral) {
        referral.status = "converted";
        referral.convertedAt = new Date();
        await referral.save();
        await User_schema.findByIdAndUpdate(referral.referrerId, { $inc: { credits: 2 } });
      }
    }

    res.json({ success: true, purchase });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
