import { Router } from 'express';
import { registerUser } from '../controller/authController';

const router = Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

export default router;
