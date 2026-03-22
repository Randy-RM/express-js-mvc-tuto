import { Router } from "express";
import { articleBaseURI, authBaseURI, userBaseURI } from "../config/paths.config";
import authRouter from "./auth.routes";
import userRouter from "./users.routes";
import articleRouter from "./articles.routes";

const router = Router();

router.use(authBaseURI, authRouter);
router.use(userBaseURI, userRouter);
router.use(articleBaseURI, articleRouter);

export default router;
