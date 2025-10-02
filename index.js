// server.js
import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import geminiResponse from "./gemini.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

// ---------- CORS Setup ----------
const allowedOrigins = [
  "http://localhost:5173",
  "https://jarvis-frontend-six.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin like Postman or server-to-server
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // allows cookies to be sent
}));

// ---------- Middleware ----------
app.use(express.json());
app.use(cookieParser());

// ---------- Routes ----------
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Gemini AI endpoint
app.get("/", async (req, res) => {
  try {
    const prompt = req.query.prompt;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const data = await geminiResponse(prompt);
    res.status(200).json(data);
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ---------- Start Server ----------
const port = process.env.PORT || 5000;
app.listen(port, async () => {
  try {
    await connectDb();
    console.log(`Server running on port ${port}`);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});
