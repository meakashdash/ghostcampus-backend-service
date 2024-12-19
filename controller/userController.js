import { ObjectId } from "mongodb";
import { MongoDBService } from "../services/MongoDBService.js";
import { TABLE_NAMES } from "../utils/config.js";
import { comparePassword, hashPassword } from "../services/BcryptService.js";

const mongoDBService = new MongoDBService();
export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.user;
    console.log(userId);
    if (!userId) {
      return res.json({
        statusCode: 400,
        message: "User id is not defined",
      });
    }
    const userDetails = await mongoDBService.getItem(
      TABLE_NAMES.USERS,
      new ObjectId(userId)
    );
    if (!userDetails) {
      return res.json({
        statusCode: 401,
        message: "User not found",
      });
    }
    return res.json({
      statusCode: 200,
      name: userDetails.userName,
      email: userDetails.email,
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const { newPassword } = req.body;
    if (!userId) {
      return res.json({
        statusCode: 400,
        message: "User id is not defined",
      });
    }
    const userDetails = await mongoDBService.getItem(
      TABLE_NAMES.USERS,
      new ObjectId(userId)
    );
    if (!userDetails) {
      return res.json({
        statusCode: 401,
        message: "User not found",
      });
    }
    const isPasswordSame = await comparePassword(
      newPassword,
      userDetails.password
    );
    if (isPasswordSame) {
      return res.json({
        statusCode: 400,
        message: "New password should be different from the old password",
      });
    }
    const hashedNewPassword = await hashPassword(newPassword);
    const filter = { _id: new ObjectId(userId) };
    const updateOperation = { $set: { password: hashedNewPassword } };
    const updateResponse = await mongoDBService.addItemQuery(
      TABLE_NAMES.USERS,
      filter,
      updateOperation
    );
    if (updateResponse.modifiedCount !== 1) {
      return res.json({
        statusCode: 404,
        message: "Unable to update the password. Please try again",
      });
    }
    return res.json({
      statusCode: 200,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.user;
    //delete from post section
    const deletePostResponse = await mongoDBService.deleteMany(
      TABLE_NAMES.POSTS,
      {userId:userId}
    );
    //delete from mood section
    const deleteMoodResponse = await mongoDBService.deleteMany(
      TABLE_NAMES.MOOD_CALENDER,
      {userId:userId}
    );
    //delete from bookmark section
    const deleteBookmarkResponse = await mongoDBService.deleteMany(
      TABLE_NAMES.BOOKMARK,
      {userId:userId}
    );
    //delete from wishlist section
    const deleteWishlistResponse = await mongoDBService.deleteMany(
      TABLE_NAMES.WISHLIST,
      {userId:userId}
    );
    //delete from market item section
    const deleteMarketItemResponse = await mongoDBService.deleteMany(
      TABLE_NAMES.MARKET_ITEM,
      {sellerid:userId}
    );
    //update user details
    const filter = { _id: new ObjectId(userId) };
    const updateOperation = {
      $set: { isPresent: false, userName: "deleted user" },
    };
    const updateUserResponse = await mongoDBService.addItemQuery(
      TABLE_NAMES.USERS,
      filter,
      updateOperation
    );
    return res.json({
      statusCode: 200,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
};
