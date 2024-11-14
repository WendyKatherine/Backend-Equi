import { Router } from "express";
import { testAuthor, saveAuthor, uploadImage, getAuthorProfile, listAuthors, updateAuthor, deleteAuthor } from "../controllers/author.js";
import { ensureAuth } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router =  Router();

router.get('/test-author', ensureAuth, testAuthor);
router.post('/save-author', ensureAuth, saveAuthor);
router.post('/upload-image-author/:id', ensureAuth, upload.single('image'), uploadImage);
router.get('/profile/:id', ensureAuth, getAuthorProfile);
router.get('/list-author/:page?', ensureAuth, listAuthors);
router.put('/update-author/:id', ensureAuth, updateAuthor);
router.delete('/delete-author/:id', ensureAuth, deleteAuthor);

export default router;