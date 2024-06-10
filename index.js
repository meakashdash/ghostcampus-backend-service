import express from "express";
import cors from "cors";
import { PORT } from "./utils/config.js";
import authRouter from "./routes/authRouter.js";
import postRouter from "./routes/postRouter.js";
import tagRouter from "./routes/tagRouter.js";
import moodRouter from "./routes/moodRouter.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const routes = [authRouter,postRouter,tagRouter,moodRouter];

routes.forEach((router) => {
  app.use(router);
});

app.listen(PORT, () => {
  console.log(`App listens on Port ${PORT}`);
});
