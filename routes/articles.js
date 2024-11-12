import { Router } from "express";
import { testArticle } from "../controllers/articles.js";
import { ensureAuth } from "../middlewares/auth.js";

const router =  Router();

router.get('/test-article', testArticle);

export default router;