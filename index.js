import express from "express";
import routes from "./routes/routes.js";
import { connectDB } from "./db/db.js";
import { PORT } from "./constants.js";
import errorHandler from "./middleware/errorHandler.middleware.js";
import { limiter } from "./middleware/rateLimiter.middleware.js";
import cors from "cors";

const app = express();

app.use(cors({ origin: "https://mern-frontend-jet.vercel.app" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(limiter);

app.use("/api/notes", routes);

app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
