import express, { Request, Response } from "express";
import { Purchase } from "../models/purchase";
import { User_schema } from "../models/user";
import { Referral } from "../models/refferal";

const router = express.Router();

router.post("/info", async (req: Request, res: Response) => {
  try {
    const {userId} = req.body;
    const user = await User_schema.findOne({userId});
    if(user){
        const total_reffered = await Referral.countDocuments({referrerId: userId})
        const converted_refferd =  await Referral.countDocuments({referrerId:userId,status:"converted"})
        const credits = user?.credits;
        res.status(201).json({credits,total_reffered,converted_refferd})
        
    }
    else {
        res.status(500).json({message:"USer not found"})
    }

  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
