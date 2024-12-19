import { ObjectId } from "mongodb";
import { comparePassword, hashPassword } from "../services/BcryptService.js";
import { MongoDBService } from "../services/MongoDBService.js"
import { JWT_KEY, TABLE_NAMES } from "../utils/config.js";
import jwt from 'jsonwebtoken'
import {uniqueNamesGenerator, adjectives, colors, names} from 'unique-names-generator'

const mongoDBService=new MongoDBService();
export const createUser=async(req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;
        const confirmPassword=req.body.confirmPassword;
        const isUserExist=await mongoDBService.findByUniqueValue(
            TABLE_NAMES.USERS,
            'email',
            email
        )
        if(isUserExist){
            return res.json({
                statusCode:401,
                message:"User Already Exist"
            })
        }
        if(!password || password.length<8){
            return res.json({
                statusCode:402,
                message:"Password must be 8 characters long"
            })
        }
        if(password!==confirmPassword){
            return res.json({
                statusCode:403,
                message:"Password must be same"
            })
        }
        const config={
            dictionaries:[adjectives,colors,names],
            separator:'-'
        }
        const userName=await uniqueNamesGenerator(config);
        const hashedPassword=await hashPassword(password);
        const userItem={
            _id:new ObjectId(),
            userName,
            email,
            password:hashedPassword,
            isPresent:true
        }
        const createUserResponse=await mongoDBService.createItem(
            TABLE_NAMES.USERS,
            userItem
        )
        return res.json({
            statusCode:200,
            message:"User Created Successfully"
        })
    } catch (error) {
        return res.json({
            statusCode:400,
            message:error.message
        })
    }
}

export const login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const isUserExist=await mongoDBService.findByUniqueValue(
            TABLE_NAMES.USERS,
            'email',
            email
        )
        if(!isUserExist){
            return res.json({
                statusCode:401,
                message:"User not exist"
            })
        }
        const isPasswordSame=await comparePassword(
            password,
            isUserExist.password
        )
        if(!isPasswordSame){
            return res.json({
                statusCode:402,
                message:"Password is incorrect"
            })
        }
        if(isUserExist.isPresent===false){
            return res.json({
                statusCode:403,
                message:"Invalid credentials"
            })
        }
        const payload={
            userId:isUserExist._id,
            userName:isUserExist.userName,
            email:isUserExist.email
        }
        const token=jwt.sign(payload,JWT_KEY,{expiresIn:'8h'})
        return res.json({
            statusCode:200,
            token,
            userId:isUserExist._id,
            message:"Logged in Successfully"
        })
    } catch (error) {
        return res.json({
            statusCode:400,
            message:error.message
        })
    }
}

export const getUserFromTokenDetails=async(req,res)=>{
    try {
        return res.json({
            statusCode:200,
            data:req.user
        })
    } catch (error) {
        return res.json({
            statusCode:400,
            message:error.message
        })
    }
}