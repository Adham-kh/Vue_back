import express from 'express';

import { loginValidation, registerValidation, validateEmail, tokenValidation} from '../validations/validations.js';
import { registerUser, loginUser, homeUser} from "../controllers/authController.js"

//express.Route(); помогает разбивать маршруты на отдельные модули
const router = express.Router();

router.post('/register', /*validateEmail,*/ registerValidation, registerUser);

router.post('/login', loginUser);

router.get('/userhome/:id',tokenValidation, homeUser);

export default router;
