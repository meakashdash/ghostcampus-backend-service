import express from 'express'
import { createComment, createPost, deleteComment, getAllComment, getAllPosts, getReplyComments, hitLikeDislike, replyComment, updateComment } from '../controller/postController.js';
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
postRouter.post(
    '/post/like',
    requiredSignin,
    hitLikeDislike
)
postRouter.post(
    '/post/comment',
    requiredSignin,
    createComment
)
postRouter.put(
    '/post/update-comment',
    requiredSignin,
    updateComment
)
postRouter.delete(
    '/post/delete-comment',
    requiredSignin,
    deleteComment
)
postRouter.post(
    '/post/reply-comment',
    requiredSignin,
    replyComment
)
postRouter.get(
    '/post/comment/:postId',
    getAllComment
)
postRouter.get(
    '/post/reply-comment/:commentId',
    getReplyComments
)

export default postRouter;