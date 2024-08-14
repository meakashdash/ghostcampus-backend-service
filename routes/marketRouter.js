import express from 'express'
import { requiredSignin } from '../middlewares/authMiddleware.js';
import { createMarketPost, getItems, getItem, addWishList, getItemByCategory } from '../controller/marketController.js';
import multer from 'multer'

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const marketRouter=express.Router();

marketRouter.post('/market',requiredSignin,upload.fields([{ name: 'images', maxCount: 5 }, { name: 'videos', maxCount: 5 }]),createMarketPost)
marketRouter.get('/market',requiredSignin,getItems)
marketRouter.get('/market/category/:categoryId',requiredSignin,getItemByCategory)
marketRouter.get('/market/:itemId', requiredSignin, getItem);
marketRouter.post('/market/wishlist',requiredSignin,addWishList)


export default marketRouter;