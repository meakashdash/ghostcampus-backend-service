import express from 'express'
import { addCategory, getCategory, getChildCategory, getParentCategory } from '../controller/categoryController.js';
import { requiredSignin } from '../middlewares/authMiddleware.js';

const categoryRouter=express.Router();

categoryRouter.post('/category',addCategory)
categoryRouter.get('/category',getCategory)
categoryRouter.get('/parent-category',requiredSignin,getParentCategory)
categoryRouter.get('/child-category/:parentCategoryId',requiredSignin,getChildCategory)

export default categoryRouter;