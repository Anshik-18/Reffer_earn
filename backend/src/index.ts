import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
import purchaseRoutes from "./routes/purchaseroutes";
import refferRoutes from "./routes/refferalroutes";
import userroutes from "./routes/user"
import dashboardRoutes from "./routes/dashboardroutes";
const app = express();
app.use(cors());
app.use(express.json());

//  DB CONNECT 
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.log(" DB Error:", err));

//  Middleware 
const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    (req as any).userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

app.use("/api/user",userroutes)
app.use("/api/purchase",purchaseRoutes );
app.use("/api/dashboard",dashboardRoutes)
app.use("/api/reffer",refferRoutes)

app.listen(process.env.PORT || 5000);
