import express from 'express'
import { createPost, getAllPosts } from '../controller/postController.js';
import { requiredSignin } from '../middlewares/authMiddleware.js';
import multer from 'multer'

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const postRouter=express.Router();

postRouter.post(
    '/post/create',
    requiredSignin,
    upload.fields([{ name: 'images', maxCount: 5 }, { name: 'videos', maxCount: 5 }]),
    createPost
)
postRouter.get(
    '/post',
    getAllPosts
)

export default postRouter;