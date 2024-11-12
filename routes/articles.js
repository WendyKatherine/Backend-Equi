import { Router } from "express";
import { testArticle, saveArticle, getArticle, listArticle,updateArticle, deleteArticle } from "../controllers/articles.js";
import { ensureAuth } from "../middlewares/auth.js";

const router =  Router();

router.get('/test-article', testArticle);
router.post('/save-article', ensureAuth, saveArticle);
router.get('/article-detail/:id', getArticle);
router.get('/list-articles/:page?', listArticle);
router.put('/update-article/:id', ensureAuth, updateArticle);
router.delete('/delete-article/:id', ensureAuth, deleteArticle);

export default router;