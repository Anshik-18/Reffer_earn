"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const purchaseroutes_1 = __importDefault(require("./routes/purchaseroutes"));
const refferalroutes_1 = __importDefault(require("./routes/refferalroutes"));
const user_1 = __importDefault(require("./routes/user"));
const dashboardroutes_1 = __importDefault(require("./routes/dashboardroutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//  DB CONNECT 
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => console.log(" MongoDB Connected"))
    .catch((err) => console.log(" DB Error:", err));
//  Middleware 
const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
        return res.status(401).json({ message: "No token provided" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    }
    catch {
        res.status(401).json({ message: "Invalid token" });
    }
};
app.use("/api/user", user_1.default);
app.use("/api/purchase", purchaseroutes_1.default);
app.use("/api/dashboard", dashboardroutes_1.default);
app.use("/api/reffer", refferalroutes_1.default);
app.listen(process.env.PORT || 5000);
