import express from 'express'
import { addCategory, getChildCategory, getParentCategory } from '../controller/categoryController.js';
import { requiredSignin } from '../middlewares/authMiddleware.js';

const categoryRouter=express.Router();

categoryRouter.post('/category',addCategory)
categoryRouter.get('/parent-category',requiredSignin,getParentCategory)
categoryRouter.get('/child-category/:parentCategoryId',requiredSignin,getChildCategory)

export default categoryRouter;