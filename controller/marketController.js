import { ObjectId } from "mongodb";
import { MongoDBService } from "../services/MongoDBService.js";
import { TABLE_NAMES } from "../utils/config.js";

const mongoDBService = new MongoDBService();
export const createMarketPost = async (req, res) => {
  try {
    const { userId } = req.user;
    const { categoryId, title, description, price, attributes, location } =
      req.body;
    const marketItem = {
      _id: new ObjectId(),
      categoryId,
      title,
      description,
      price,
      attributes,
      location,
      sellerid: userId,
      status: "active",
      createdAt: new Date(),
    };
    const marketCreateResponse = await mongoDBService.createItem(
      TABLE_NAMES.MARKET_ITEM,
      marketItem
    );
    if (!marketCreateResponse) {
      return res.json({
        statusCode: 500,
        message: "Item Creation Failed",
      });
    }
    return res.json({
      statusCode: 200,
      message: "Item Created Successfully and Now Ready in Market!",
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
};

export const getItems = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const numericPage = Number(page);
    const numericLimit = Number(limit);
    const skip = (numericPage - 1) * numericLimit;

    const query = [
      {
        $match: {
          status: "active",
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: numericLimit,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: TABLE_NAMES.MARKET_ITEM_CATEGORY,
          let: { categoryId: { $toObjectId: "$categoryId" } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$categoryId"],
                },
              },
            },
          ],
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $project: {
          _id: 1,
          categoryId: 1,
          title: 1,
          price: 1,
          createdAt: 1,
          categoryName: "$category.categoryName",
        },
      },
    ];
    const items = await mongoDBService.findByQuery(
      TABLE_NAMES.MARKET_ITEM,
      query
    );

    if (!items || items.length === 0) {
      return res.json({
        statusCode: 404,
        message: "Items not found",
      });
    }

    return res.json({
      statusCode: 200,
      items,
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
};

export const getItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const query=[
      {
        $match:{
          _id:new ObjectId(itemId)
        }
      },
      {
        $lookup: {
          from: TABLE_NAMES.MARKET_ITEM_CATEGORY,
          let: { categoryId: { $toObjectId: "$categoryId" } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$categoryId"],
                },
              },
            },
            {
              $project: {
                categoryName: 1,
              },
            },
          ],
          as: "category",
        },
      },
    ]
    const item = await mongoDBService.findByQuery(TABLE_NAMES.MARKET_ITEM, query);
    if (!item) {
      return res.json({
        statusCode: 404,
        message: "Item not Found",
      });
    }
    return res.json({
      statusCode: 200,
      item:item[0],
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
};

export const getItemByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const query = [
      {
        $match: {
          categoryId: categoryId,
        },
      },
    ];
    const itemByCategoryDetails = await mongoDBService.findByQuery(
      TABLE_NAMES.MARKET_ITEM,
      query
    );
    if (!itemByCategoryDetails) {
      return res.json({
        statusCode: 404,
        message: "Items not Found",
      });
    }
    itemDetails = await mongoDBService.paginate(
      itemByCategoryDetails,
      Number(req.query.page),
      10
    );
    return res.json({
      statusCode: 200,
      itemDetails,
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
};

export const getItemsByCategory=async(req,res)=>{
  try {
    
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
}
