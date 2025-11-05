import express, { Request, Response } from "express";
import { Purchase } from "../models/purchase";
import { User_schema } from "../models/user";
import { Referral } from "../models/refferal";

const router = express.Router();

router.post("/info", async (req: Request, res: Response) => {
  try {
    console.log("body",req.body)
    const {_id} = req.body;
    const user = await User_schema.findById({_id});
    if(user){
      const name = user?.name
      const refferalcode = user.referralCode
        const total_reffered = await Referral.countDocuments({referrerId: _id})
        const converted_refferd =  await Referral.countDocuments({referrerId:_id,status:"converted"})
        const credits = user?.credits;
        res.status(201).json({refferalcode,name,credits,total_reffered,converted_refferd})
        
    }
    else {
        res.status(500).json({message:"USer not found"})
    }

  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
