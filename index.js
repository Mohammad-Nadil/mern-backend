import express from "express";
import routes from "./routes/routes.js";
import { connectDB } from "./db/db.js";
import { PORT } from "./constants.js";
import errorHandler from "./middleware/errorHandler.middleware.js";
import { limiter } from "./middleware/rateLimiter.middleware.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: ["https://mern-frontend-jet.vercel.app", "http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.use(cookieParser());
app.use(limiter);

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
