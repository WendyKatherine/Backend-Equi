import { Router } from "express";
import { testAuthor, saveAuthor, getAuthorProfile, listAuthors, uploadImageAuthor, updateAuthor, deleteAuthor } from "../controllers/author.js";
import { ensureAuth } from "../middlewares/auth.js";
import connectMultiparty from "connect-multiparty";

const router =  Router();

const multipartMiddleware = connectMultiparty({ uploadDir: "./uploads" });

router.get('/test-author', ensureAuth, testAuthor);
router.post('/save-author', ensureAuth, saveAuthor);
router.get('/profile/:id', ensureAuth, getAuthorProfile);
router.get('/list-author/:page?', ensureAuth, listAuthors);
router.post('/upload-imageauthor/:id', ensureAuth, multipartMiddleware, uploadImageAuthor);
router.put('/update-author/:id', ensureAuth, updateAuthor);
router.delete('/delete-author/:id', ensureAuth, deleteAuthor);

export default router;