import { Router } from "express";
import { testUser, register, login, getUserProfile, listUsers, uploadImageUser, updateUser, deleteUser, getImageFile } from "../controllers/user.js";
import { ensureAuth } from '../middlewares/auth.js';
import connectMultiparty from "connect-multiparty";

const router = Router();

const multipartMiddleware = connectMultiparty({ uploadDir: "./uploads" });

router.get('/test-user', ensureAuth, testUser);
router.post('/register', register);
router.post('/login', login);
router.get('/user-profile/:id', ensureAuth, getUserProfile);
router.get('/list-users/:page?', ensureAuth, listUsers);
router.post('/upload-imageuser/:id', ensureAuth, multipartMiddleware, uploadImageUser);
router.get('/get-imageuser/:image', ensureAuth, multipartMiddleware, getImageFile);
router.put('/update-user/:id', ensureAuth, updateUser);
router.delete('/delete-user/:id', ensureAuth, deleteUser);

export default router;