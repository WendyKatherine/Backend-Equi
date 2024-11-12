import { Router } from "express";
import { testUser, register, login } from "../controllers/user.js";
import { ensureAuth } from '../middlewares/auth.js';
import multer from "multer";

const router = Router();

router.get('/test-user', ensureAuth, testUser);
router.post('/register', register);
router.post('/login', login);

export default router;