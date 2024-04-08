import { MongoDBService } from "../services/MongoDBService.js";
import { JWT_KEY } from "../utils/config.js";

const mongoDBService=new MongoDBService();
export const requiredSignin=async(req,res,next)=>{
    try {
        const token=req.headers.authorization;
        if(!token){
            return res.json({
                statusCode:401,
                message:"Log in to continue this operation"
            })
        }
        const realToken=token.replace(/^"(.*)"$/, '$1');
        const decoded=await mongoDBService.verifyToken(realToken,JWT_KEY)
        if(!decoded){
            return res.json({
                statusCode:402,
                message:"JWT Verification Failed"
            })
        }
        req.user=decoded;
        next();
    } catch (error) {
        return res.json({
            statusCode:400,
            message:error.message
        })
    }
}