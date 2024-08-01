import express from 'express'
import { requiredSignin } from '../middlewares/authMiddleware.js';
import { createMarketPost, getItems } from '../controller/marketController.js';
import multer from 'multer'

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const marketRouter=express.Router();

marketRouter.post('/market',requiredSignin,upload.fields([{ name: 'images', maxCount: 5 }, { name: 'videos', maxCount: 5 }]),createMarketPost)
marketRouter.get('/market',requiredSignin,getItems)

export default marketRouter;