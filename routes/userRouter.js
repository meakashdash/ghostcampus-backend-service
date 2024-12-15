import express from 'express'
import { requiredSignin } from '../middlewares/authMiddleware.js';
import { changePassword, getUserDetails } from '../controller/userController.js';

const userRouter=express.Router();

userRouter.get('/user',requiredSignin,getUserDetails)
userRouter.post('/user/change-password',requiredSignin,changePassword)


export default userRouter;