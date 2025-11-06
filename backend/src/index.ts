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
const allowedOrigins = [
  "http://localhost:3000",              // local dev
  "https://reffer-earn-psi.vercel.app", // deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `CORS error: This site ${origin} is not allowed.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue:false
  })
);
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
