import express from 'express'
import { requiredSignin } from '../middlewares/authMiddleware.js';
import { createMood, getMoodPerMonth } from '../controller/moodController.js';


const moodRouter=express.Router();

moodRouter.post('/mood/create-mood',requiredSignin,createMood)
moodRouter.get('/mood/get-mood',requiredSignin,getMoodPerMonth)

export default moodRouter;