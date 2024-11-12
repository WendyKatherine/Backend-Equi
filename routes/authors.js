import { Router } from "express";
import { testAuthor, saveAuthor } from "../controllers/author.js";
import { ensureAuth } from "../middlewares/auth.js";

const router =  Router();

router.get('/test-author', ensureAuth, testAuthor);
router.post('/save-author', ensureAuth, saveAuthor);

export default router;