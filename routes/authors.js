import { Router } from "express";
import { testAuthor, saveAuthor, getAuthorProfile, listAuthors, updateAuthor, deleteAuthor } from "../controllers/author.js";
import { ensureAuth } from "../middlewares/auth.js";

const router =  Router();

router.get('/test-author', ensureAuth, testAuthor);
router.post('/save-author', ensureAuth, saveAuthor);
router.get('/profile/:id', ensureAuth, getAuthorProfile);
router.get('/list/:page?', ensureAuth, listAuthors);
router.put('/update-author/:id', ensureAuth, updateAuthor);
router.delete('/delete-author/:id', ensureAuth, deleteAuthor);

export default router;