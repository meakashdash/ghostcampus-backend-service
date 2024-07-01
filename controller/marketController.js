import { ObjectId } from "mongodb";
import { MongoDBService } from "../services/MongoDBService.js";
import { TABLE_NAMES } from "../utils/config.js";

const mongoDBService=new MongoDBService();
export const createMarketPost=async(req,res)=>{
    try {
        const {userId}=req.user;
        const {categoryId,title,description,price,attributes,location}=req.body;
        const marketItem={
            _id: new ObjectId(),
            categoryId,
            title,
            description,
            price,
            attributes,
            location,
            sellerid:userId,
            status:"active",
            createdAt:new Date()
        }
        const marketCreateResponse=await mongoDBService.createItem(
            TABLE_NAMES.MARKET_ITEM,
            marketItem
        )
        if(!marketCreateResponse){
            return res.json({
                statusCode:500,
                message:"Item Creation Failed"
            })
        }
        return res.json({
            statusCode:200,
            message:"Item Created Successfully and Now Ready in Market!"
        })
    } catch (error) {
        return res.json({
            statusCode: 400,
            message: error.message,
        });
    }
}

export const getItems=async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}