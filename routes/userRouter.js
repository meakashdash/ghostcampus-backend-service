import express from 'express'
import { requiredSignin } from '../middlewares/authMiddleware.js';
import { getUserDetails } from '../controller/userController.js';

const userRouter=express.Router();

userRouter.get('/user',requiredSignin,getUserDetails)


export default userRouter;