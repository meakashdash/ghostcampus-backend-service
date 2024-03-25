import { ObjectId } from "mongodb"
import { MongoDBService } from "../services/MongoDBService.js";
import { S3Service } from "../services/S3Service.js";
import { BUCKET_NAME, TABLE_NAMES } from "../utils/config.js";

const mongoDBService=new MongoDBService();
const s3Service=new S3Service();
export const createPost=async(req,res)=>{
    try {
        const {userId}=req.user;
        const media={
        }
        const timestamp = Date.now().toString();
        const imageKey=`images/${timestamp}`
        const images=await s3Service.uploadImages(
            req.files,
            BUCKET_NAME,
            "posts",
            imageKey
        )
        media.images=images;
        const videoKey=`videos/${timestamp}`
        const videos=await s3Service.uploadVideos(
            req.files,
            BUCKET_NAME,
            "posts",
            videoKey
        )
        media.videos=videos;
        const postItem={
            _id:new ObjectId(),
            userId:userId,
            title:req.body.title,
            media:media,
            postType:'post',
            createdAt:new Date(),
        }
        const createPostResponse=await mongoDBService.createItem(
            TABLE_NAMES.POSTS,
            postItem
        )
        if(!createPostResponse){
            return res.json({
                statusCode:401,
                message:"Unable to Post.Try again"
            })
        }
        return res.json({
            statusCode:200,
            message:"Post Created Successfully"
        })
    } catch (error) {
        return res.json({
            statusCode:400,
            message:error.message
        })
    }
}

//should be written again
export const getAllPosts=async(req,res)=>{
    try {
        let posts=await mongoDBService.getAllItem(
            TABLE_NAMES.POSTS
        )
        if(!posts){
            return res.json({
                statusCode:401,
                message:"Unable to Load Posts"
            })
        }
        return res.json({
            statusCode:200,
            posts
        })
    } catch (error) {
        return res.json({
            statusCode:400,
            message:error.message
        })
    }
}