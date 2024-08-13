import express from 'express'
import { requiredSignin } from '../middlewares/authMiddleware.js';
import { createMarketPost, getItems, getItem } from '../controller/marketController.js';
import multer from 'multer'

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const marketRouter=express.Router();

marketRouter.post('/market',requiredSignin,upload.fields([{ name: 'images', maxCount: 5 }, { name: 'videos', maxCount: 5 }]),createMarketPost)
marketRouter.get('/market',requiredSignin,getItems)
<<<<<<< Updated upstream
marketRouter.get('/market/:id',requiredSignin,getItem)
=======
marketRouter.get('/market/:id',requiredSignin,getItemsByCategory)
>>>>>>> Stashed changes

export default marketRouter;