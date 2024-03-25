import express from 'express'
import { createTag, getAllTags, getTagById } from '../controller/tagController.js';

const tagRouter=express.Router();

tagRouter.post('/tag/create',createTag)
tagRouter.get('/tag',getAllTags)
tagRouter.get('/tag/:tagId',getTagById)

export default tagRouter