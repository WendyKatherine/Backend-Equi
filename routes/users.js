import { Router } from "express";
import { testUser, register, login, getUserProfile, listUsers, uploadImage, updateUser, deleteUser } from "../controllers/user.js";
import { ensureAuth } from '../middlewares/auth.js';
import upload from "../middlewares/upload.js";

const router = Router();

router.get('/test-user', ensureAuth, testUser);
router.post('/register', register);
router.post('/login', login);
router.get('/user-profile/:id', ensureAuth, getUserProfile);
router.get('/list-users/:page?', ensureAuth, listUsers);
router.post('/upload-image-user/:id', ensureAuth, upload.single('image'), uploadImage);
router.put('/update-user/:id', ensureAuth, updateUser);
router.delete('/delete-user/:id', ensureAuth, deleteUser);

export default router;