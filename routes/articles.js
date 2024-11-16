import { Router } from "express";
import { testArticle, saveArticle, uploadImageArticle, getImageFile, getArticle, listArticle,updateArticle, deleteArticle } from "../controllers/articles.js";
import { ensureAuth } from "../middlewares/auth.js";
import connectMultiparty from "connect-multiparty";

const router =  Router();

const multipartMiddleware = connectMultiparty({ uploadDir: "./uploads" });

router.get('/test-article', testArticle);
router.post('/save-article', ensureAuth, saveArticle);
router.post('/upload-imagearticle/:id', ensureAuth, multipartMiddleware, uploadImageArticle);
router.get('/get-imageuser/:image', ensureAuth, multipartMiddleware, getImageFile);
router.get('/article-detail/:id', getArticle);
router.get('/list-articles/:page?', listArticle);
router.put('/update-article/:id', ensureAuth, updateArticle);
router.delete('/delete-article/:id', ensureAuth, deleteArticle);

export default router;