import express from "express";
import routes from "./routes/routes.js";
import { connectDB } from "./db/db.js";
import { PORT } from "./constants.js";
import errorHandler from "./middleware/errorHandler.middleware.js";
import { limiter } from "./middleware/rateLimiter.middleware.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://mern-frontend-jet.vercel.app", // Your production frontend
].filter(Boolean);

console.log("🌐 Allowed CORS origins:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        console.log("✅ CORS allowed for:", origin);
        callback(null, true);
      } else {
        console.log("❌ CORS blocked for:", origin);
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.use(cookieParser());
app.use(limiter);

app.get("/", (req, res) => {
  res.json({
    message: "API is running",
    origin: req.headers.origin,
    cookies: req.cookies,
  });
});

app.use("/api", routes);

app.use(errorHandler);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
