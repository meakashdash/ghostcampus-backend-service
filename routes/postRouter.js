import express from 'express'
import { createComment, createPost, deleteComment, getAllComment, getAllPosts, getReplyComments, getUserBookmarks, getUserDownvote, getUserLikes, hitBookmark, hitDownvote, hitLikeDislike, replyComment, updateComment } from '../controller/postController.js';
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
    '/post/bookmark',
    requiredSignin,
    hitBookmark
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
postRouter.get(
    '/post/get-user-likes',
    requiredSignin,
    getUserLikes
)
postRouter.get(
    '/post/get-user-bookmarks',
    requiredSignin,
    getUserBookmarks
)
postRouter.post(
    '/post/downvote',
    requiredSignin,
    hitDownvote
)
postRouter.get(
    '/post/get-user-downvote',
    requiredSignin,
    getUserDownvote
)

export default postRouter;