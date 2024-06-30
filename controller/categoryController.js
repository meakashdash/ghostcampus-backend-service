import { ObjectId } from "mongodb";
import { MongoDBService } from "../services/MongoDBService.js";
import { TABLE_NAMES } from "../utils/config.js";
const mongoDBService = new MongoDBService();
export const addCategory=async(req,res)=>{
    try {
        let categoryItem;
        if(req.body.type==='parent'){
            categoryItem={
                _id: new ObjectId(),
                categoryName:req.body.categoryName,
                type:req.body.type,
                childrens:req.body.childrens
            }
            const createCategoryResponse=await mongoDBService.createItem(
                TABLE_NAMES.MARKET_ITEM_CATEGORY,
                categoryItem
            )
            if(!createCategoryResponse){
                return res.json({
                    statusCode:500,
                    message:"Category Creation Failed"
                })
            }
            return res.json({
                statusCode:200,
                message:"Category Created Successfully"
            })
        }else{
            categoryItem={
                _id: new ObjectId(),
                categoryName:req.body.categoryName,
                type:req.body.type,
                parentCategoryId:req.body.parentCategoryId,
                attributes:req.body.attributes
            }
            const createCategoryResponse=await mongoDBService.createItem(
                TABLE_NAMES.MARKET_ITEM_CATEGORY,
                categoryItem
            )
            if(!createCategoryResponse){
                return res.json({
                    statusCode:500,
                    message:"Category Creation Failed"
                })
            }
            return res.json({
                statusCode:200,
                message:"Category Created Successfully"
            })
        }
    } catch (error) {
        return res.json({
            statusCode: 400,
            message: error.message,
        });
    }
}

export const getParentCategory=async(req,res)=>{
    try {
        const query=[{
            $match:{
                type:'parent'
            }
        }]
        const parentResponse=await mongoDBService.findByQuery(
            TABLE_NAMES.MARKET_ITEM_CATEGORY,
            query
        )
        if(!parentResponse){
            return res.json({
                statusCode:404,
                message:"No Parent Category Found"
            })
        }
        return res.json({
            statusCode:200,
            parentResponse
        })
    } catch (error) {
        return res.json({
            statusCode: 400,
            message: error.message,
        });
    }
}

export const getChildCategory=async(req,res)=>{
    try {
        const query=[{
            $match:{
                parentCategoryId:req.params.parentCategoryId
            }
        }]
        const childResponse=await mongoDBService.findByQuery(
            TABLE_NAMES.MARKET_ITEM_CATEGORY,
            query
        )
        if(!childResponse){
            return res.json({
                statusCode:404,
                message:"No Child Category Found"
            })
        }
        return res.json({
            statusCode:200,
            childResponse
        })
    } catch (error) {
        return res.json({
            statusCode: 400,
            message: error.message,
        });
    }
}