import express from 'express'
import { requiredSignin } from '../middlewares/authMiddleware.js';
import { changePassword, deleteUser, getUserDetails } from '../controller/userController.js';

const userRouter=express.Router();

userRouter.get('/user',requiredSignin,getUserDetails)
userRouter.post('/user/change-password',requiredSignin,changePassword)
userRouter.post('/user/delete',requiredSignin,deleteUser)


export default userRouter;