import express from 'express'
import { createUser, getUserFromTokenDetails, login } from '../controller/authController.js';
import { requiredSignin } from '../middlewares/authMiddleware.js';

const authRouter=express.Router();

authRouter.post('/auth/create',createUser)
authRouter.post('/auth/login',login)
authRouter.get('/auth/token/user',requiredSignin,getUserFromTokenDetails)

export default authRouter