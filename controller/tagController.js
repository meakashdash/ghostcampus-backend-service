import { ObjectId } from "mongodb";
import { MongoDBService } from "../services/MongoDBService.js";
import { TABLE_NAMES } from "../utils/config.js";

const mongoDBService=new MongoDBService();
export const createTag=async(req,res)=>{
    try {
        const {color,text}=req.body;
        const isTagExist=await mongoDBService.findByUniqueValue(
            TABLE_NAMES.TAGS,
            'text',
            text
        )
        if(isTagExist){
            return res.json({
                statusCode:401,
                message:"Tag is Already Exist"
            })
        }
        const tagItem={
            _id:new ObjectId(),
            color:color,
            text:text
        }
        const createTagResponse=await mongoDBService.createItem(
            TABLE_NAMES.TAGS,
            tagItem
        )
        if(!createTagResponse){
            return res.json({
                statusCode:402,
                message:"Tag Creation Falied"
            })
        }
        return res.json({
            statusCode:200,
            message:"Tag Created Successfully"
        })
    } catch (error) {
        return res.json({
            statusCode:400,
            message:error.message
        })
    }
}

export const getAllTags=async(req,res)=>{
    try {
        const tags=await mongoDBService.getAllItem(
            TABLE_NAMES.TAGS
        )
        if(!tags){
            return res.json({
                statusCode:401,
                message:"No tag available"
            })
        }
        return res.json({
            statusCode:200,
            tags
        })
    } catch (error) {
        return res.json({
            statusCode:400,
            message:error.message
        })
    }
}

export const getTagById=async(req,res)=>{
    try {
        const {tagId}=req.params;
        const tag=await mongoDBService.getItem(
            TABLE_NAMES.TAGS,
            tagId
        )
        if(!tag){
            return res.json({
                statusCode:401,
                message:"No tag available"
            })
        }
        return res.json({
            statusCode:200,
            tag
        })
    } catch (error) {
        return res.json({
            statusCode:400,
            message:error.message
        })
    }
}