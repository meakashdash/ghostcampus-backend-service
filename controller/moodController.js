import { ObjectId } from "mongodb";
import { MongoDBService } from "../services/MongoDBService.js";
import { TABLE_NAMES } from "../utils/config.js";
import moment from "moment";

const mongoDBService = new MongoDBService();

export const createMood = async (req, res) => {
  try {
    const { userId } = req.user;
    const inputDate = moment(req.body.date, 'YYYY-MM-DD').format('YYYY-MM-DD');
    if(inputDate>moment().format('YYYY-MM-DD')){
        return res.json({
            statusCode:400,
            message:"Can't Post Mood for Future"
        })
    }
    const query = [{
      $match:{
        userId: userId,
        date: req.body.date,
      }
    }]
    const moodResponse = await mongoDBService.findByQuery(
      TABLE_NAMES.MOOD_CALENDER,
      query
    );
    if (moodResponse.length !== 0) {
      const mood = moodResponse[0];
      const filter = { _id: new ObjectId(mood._id) };
      const updateOperation = { $set: { mood: req.body.mood } };
      const updateResponse = await mongoDBService.addItemQuery(
        TABLE_NAMES.MOOD_CALENDER,
        filter,
        updateOperation
      );
      if (!updateResponse) {
        return res.json({
          statusCode: 404,
          message: "Unable to update the mood. Please try again",
        });
      }

      return res.json({
        statusCode: 200,
        message: "Mood Updated Successfully",
      });
    } else {
      const moodItem = {
        _id: new ObjectId(),
        userId: userId,
        date: req.body.date,
        mood: req.body.mood,
      };
      const moodCreateResponse = await mongoDBService.createItem(
        TABLE_NAMES.MOOD_CALENDER,
        moodItem
      );
      if (!moodCreateResponse) {
        return res.json({
          statusCode: 401,
          message: "Mood Creation Failed. Try Again",
        });
      }
      return res.json({
        statusCode: 200,
        message: "Mood Created Successfully",
      });
    }
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
};

export const getMoodPerMonth = async (req, res) => {
  try {
    const { month, year } = req.query;
    const { userId } = req.user;
    if (!month || !year) {
      return res.json({
        statusCode: 400,
        message: "Month and year are required",
      });
    }
    const monthInt = parseInt(month);
    const yearInt = parseInt(year);
    const startOfMonth = moment([yearInt, monthInt - 1])
      .startOf("month")
      .format("YYYY-MM-DD");
    const endOfMonth = moment([yearInt, monthInt - 1])
      .endOf("month")
      .format("YYYY-MM-DD");
    const query = {
      userId: userId,
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    };
    const moods = await mongoDBService.findByQueryArray(
      TABLE_NAMES.MOOD_CALENDER,
      query
    );
    return res.json({
      statusCode: 200,
      moods,
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
};
