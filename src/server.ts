import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { connectDatabase, disconnectDatabase } from "./config/database.config";
import configurePassport from "./config/passport.config";
import swaggerSpec from "./config/swagger.config";
import router from "./routes";
import { logger, errorHandler } from "./middlewares";

const app = express();
const PORT = process.env.PORT || 8000;

const corsOptions: cors.CorsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [process.env.API_HOST || "", process.env.CLIENT_HOST || ""]
      : "*",
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    status: 429,
    message: "Too many requests, please try again later",
  },
});

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(helmet());
app.use(limiter);

configurePassport(passport);
app.use(passport.initialize());

app.use(logger);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api", (_req: Request, res: Response) => {
  res.json({ message: "Welcome to Express MVC Tuto API" });
});
app.use("/api", router);
app.use(errorHandler);

async function start(): Promise<void> {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server listen on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("DB connection error:", error);
    console.error(`Server can't listen on http://localhost:${PORT}`);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await disconnectDatabase();
  process.exit(0);
});

start();

export default app;
