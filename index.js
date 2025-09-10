import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import userRouter from "./routes/user.routes.js";
import geminiResponse from "./gemini.js";

dotenv.config();

const app = express();
app.use(cors({credentials: true, origin: "http://localhost:5173"}))
const port = process.env.PORT || 5000;
app.use (express.json())
app.use(cookieParser())
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)




app.get("/",async(req,res)=>{
    let prompt = req.query.prompt;
    let data = await geminiResponse(prompt);
    res.status(200).json(data);

})


app.listen(port, () => {
    connectDb();
    console.log(`Example app listening on port ${port}`);
});