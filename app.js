import express from "express";
import logger from "morgan";
import cors from "cors";
import connectToDb from "./utils/connectToDb.js";
import authRouter from "./routes/api/auth.js";
import passport from "passport";
import "./passport.js";
import bodyParser from "body-parser";

const app = express();
app.use(passport.initialize());

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// Definirea allowedOrigins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "http://localhost:3000",
  "https://slim-mom-backend-c3173ac7e4c4.herokuapp.com/",
  "https://robertsovar.github.io",
]; // adaugă și alte origini dacă este necesar

connectToDb();

app.use(logger(formatsLogger));

app.use(
  cors({
    origin: function (origin, callback) {
      // Permite cererile fără origine (de exemplu, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "Originea CORS neautorizată";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // metodele permise
    allowedHeaders: ["Content-Type", "Authorization"], // anteturile permise
    optionsSuccessStatus: 204, // Pentru a se potrivi cu răspunsul 204
  })
);

app.use(bodyParser.json());

app.options("/api/auth/signup", cors());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(400).json({ error: err.message });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/auth", authRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

export default app;
