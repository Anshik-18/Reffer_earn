import express, { Request, Response } from "express";
import { Purchase } from "../models/purchase";
import { User_schema } from "../models/user";
import { Referral } from "../models/refferal";

const router = express.Router();
// get the refferal code 
router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, referralCode } = req.body;
    const user = await User_schema.findOne({referralCode})
    if(user){
        const referrerId = user?.id
        const referredId = userId

        const refferal = await Referral.create({referrerId,referredId})
        res.status(201).json({success: true})
    }
    else{
        res.status(500).json({message:"Invalid refferal code"})
    }

  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});
// create a reffer 
router.post("/code", async (req: Request, res: Response) => {
  try {
    const { userId, amount } = req.body;
    const user = await User_schema.findOne({userId});
    const refferalcode = user?.referralCode
    res.status(201).json({refferalcode})

  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
