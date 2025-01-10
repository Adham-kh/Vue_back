import express from 'express';

import homeUser from "../controllers/userController.js"


const userrouter = express.Router();

userrouter.post('/UserHome/:id', homeUser);

export default userrouter;