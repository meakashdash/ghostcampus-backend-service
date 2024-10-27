import { ObjectId } from "mongodb";
import { MongoDBService } from "../services/MongoDBService.js";
import { TABLE_NAMES } from "../utils/config.js";
import { response } from "express";

const mongoDBService=new MongoDBService();
export const getUserDetails=async(req,res)=>{
    try {
        const {userId}=req.user;
        console.log(userId);
        if(!userId){
            return res.json({
                statusCode:400,
                message:"User id is not defined"
            })
        }
        const userDetails=await mongoDBService.getItem(
            TABLE_NAMES.USERS,
            new ObjectId(userId)
        )
        if(!userDetails){
            return res.json({
                statusCode:401,
                message:"User not found"
            })
        }
        return res.json({
            statusCode:200,
            name:userDetails.userName,
            email:userDetails.email,
        })
    } catch (error) {
        return res.json({
            statusCode:400,
            message:error.message
        })
    }
}