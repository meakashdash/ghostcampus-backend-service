import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { MONGO_URI, DATABASE_NAME } from "../utils/config.js";

export class MongoDBService {
  constructor() {
    this.client = new MongoClient(MONGO_URI);
    this.db = null;
    this.connect().then(() => {
      this.db = this.client.db(DATABASE_NAME);
    });
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(DATABASE_NAME);
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  async getItem(collectionName, id, dbName) {
    try {
      const db = dbName ? this.client.db(dbName) : this.db;
      const collection = db.collection(collectionName);
      const res = await collection.findOne({ _id: new ObjectId(id) });
      return res;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllItem(collectionName, dbName) {
    try {
      const db = dbName ? this.client.db(dbName) : this.db;
      const collection = db.collection(collectionName);
      const res = await collection.find({}).toArray();
      return res;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllTrails(collectionName, filter = {}, dbName) {
    try {
      const db = dbName ? this.client.db(dbName) : this.db;
      const collection = db.collection(collectionName);
      const res = await collection.find(filter).toArray();
      return res;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createItem(collectionName, data, dbName) {
    try {
      const db = dbName ? this.client.db(dbName) : this.db;
      const collection = db.collection(collectionName);
      const res = await collection.insertOne(data);
      return res;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateItem(collectionName, keyName, keyValue, updateValues, dbName) {
    try {
      const db = dbName ? this.client.db(dbName) : this.db;
      const filter = { [keyName]: keyValue };
      const update = { $set: updateValues };
      const collection = db.collection(collectionName);
      const res = await collection.updateOne(filter, update);
      return res;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateItemQuery(collectionName, filter, updateValues, dbName) {
    try {
      const db = dbName ? this.client.db(dbName) : this.db;
      const update = { $set: updateValues };
      const collection = db.collection(collectionName);
      const res = await collection.updateOne(filter, update);
      return res;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addItemQuery(collectionName, filter, updateOperation, dbName) {
    try {
      const db = dbName ? this.client.db(dbName) : this.db;
      const collection = db.collection(collectionName);
      const res = await collection.updateOne(filter, updateOperation);
      return res;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateItembyId(collectionName, _id, updateData, dbName) {
    try {
      const db = dbName ? this.client.db(dbName) : this.db;
      const collection = db.collection(collectionName);
      const id = typeof _id === 'string' ? new ObjectId(_id) : _id;
      const res = await collection.updateOne(
        { _id: id },
        updateData
      );
      if (res.matchedCount === 0) {
        throw new Error('No document found with the provided _id');
      }
      return res;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOneAndUpdate(collectionName, filter, update, dbName, options) {
    try {
      const db = dbName ? this.client.db(dbName) : this.db;
      const collection = db.collection(collectionName);
      const result = await collection.findOneAndUpdate(filter, update, options);
      if (!result.value) {
        throw new Error('No document found with the provided filter');
      }
      return result.value;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteItem(collectionName, keyName, keyValue, dbName) {
    try {
      const db = dbName ? this.client.db(dbName) : this.db;
      const filter = { [keyName]: keyValue };
      const collection = db.collection(collectionName);
      const res = await collection.deleteOne(filter);
      return res;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteMany(collectionName, filter, dbName) {
    try {
      const db = dbName ? this.client.db(dbName) : this.db;
      const collection = db.collection(collectionName);
      const res = await collection.deleteMany(filter);
      return res;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findByUniqueValue(collectionName, field, value, dbName) {
    try {
      const db = dbName ? this.client.db(dbName) : this.db;
      const collection = db.collection(collectionName);
      const filter = { [field]: value };
      const res = await collection.findOne(filter);
      return res;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findByUnqiueValueObject(collectionName, field, value, dbName) {
    try {
      const db = dbName ? this.client.db(dbName) : this.db;
      const collection = db.collection(collectionName);
      value = new ObjectId(value);
      const filter = { [field]: value };
      const res = await collection.find(filter).toArray();
      return res;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAllDocument(collectionName, field, value, dbName) {
    try {
      const db = dbName ? this.client.db(dbName) : this.db;
      const collection = db.collection(collectionName);
      const filter = { [field]: value };
      const res = await collection.find(filter).toArray();
      return res;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  verifyToken(token, secret) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }

  async findByQueryArray(collectionName, query, dbName) {
    try {
      const db = dbName ? this.client.db(dbName) : this.db;
      const collection = db.collection(collectionName);
      const queryResult = await collection.find(query).toArray();
      return queryResult;
    } catch (err) { console.log(err) }
  }

  async findByQueryWithProjection(collectionName, query, projection = {}, dbName) {
    try {
      const db = dbName ? this.client.db(dbName) : this.db;
      const collection = db.collection(collectionName);
      const queryResult = await collection.find(query).project(projection).toArray();
      return queryResult;
    } catch (err) {
      console.log(err);
    }
  }
  
  async createIndexesForFields(collectionName, fields, dbName) {
    try {
      const db = dbName ? this.client.db(dbName) : this.db;
      const collection = db.collection(collectionName);
      await collection.dropIndexes();
      let field_name = {};
      const indexName = `compound_text_index`;
      for (const field of fields) {
        field_name[field] = "text";
      }
      await collection.createIndex(field_name, { name: indexName });
    } catch (error) {
      console.error('Error creating indexes:', error);
      throw error;
    }
  }
  
  /* ---- function for pagination for send data to client side paginated way by reversing the data inside each objects array  ---- */
  
  async paginationData(collectionName, tenantid, page = 1, limit = 10, dbName) {
    try {
      const db = dbName ? this.client.db(dbName) : this.db;
      const collection = db.collection(collectionName);
      let pipeline = [
        { $match: { tenant_id: tenantid } },
        { $addFields: { data: { $reverseArray: "$data" } } },
        { $unwind: "$data" },
        {
          $group: {
            _id: null,
            data: { $push: "$data" },
            total_Number_data: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            data: { $slice: ["$data", (page - 1) * limit, { $toInt: limit }] },
            total_Number_data: 1
          }
        }
      ];
      const results = await collection.aggregate(pipeline).toArray();
      const totalPage = Math.ceil(results[0].total_Number_data / limit);
      return {
        total_Number_data: results[0].total_Number_data,
        page_no: page,
        total_Page: totalPage,
        page_size: limit,
        data: results[0].data
      };
    } catch (err) {
      console.log(err);
    }
  }
  
  async cloneAndUpdate(collectionName, filter, updateFields, dbName, options) {
    try {
      // Fetch the document to clone
      const db = dbName ? this.client.db(dbName) : this.db;
      const collection = db.collection(collectionName);
      const documentToClone = await collection.findOne(filter);
  
      if (!documentToClone) {
        throw new Error('No document found with the provided filter');
      }
  
      // Clone the document
      const clonedDocument = { ...documentToClone };
      delete clonedDocument._id;
  
      // Update the fields
      for (const key in updateFields) {
        if (key === 'data' && documentToClone[key]) {
          // Merge the data objects
          clonedDocument[key] = { ...documentToClone[key], ...updateFields[key] };
        } else {
          clonedDocument[key] = updateFields[key];
        }
      }
  
      // Insert the cloned and updated document back into the collection
      const insertedDocument = await collection.insertOne(clonedDocument);
  
      return insertedDocument;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
  async createTextIndex(collectionName, name, desc, dbName) {
    try {
      const db = dbName ? this.client.db(dbName) : this.db;
      const collection = db.collection(collectionName);
      const indexSpecification = {};
      indexSpecification[name] = "text";
      indexSpecification[desc] = "text";
      const result = await collection.createIndex(indexSpecification);
      return result;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  
  async textSearch(collectionName, text, dbName) {
    try {
      const db = dbName ? this.client.db(dbName) : this.db;
      const collection = db.collection(collectionName);
  
      const queryResult = await collection.aggregate([
        {
          $search: {
            index: "Product",
            text: {
              query: text,
              path: {
                wildcard: "*"
              },
              fuzzy: {
                maxEdits: 2,
              },
            }
          }
        }
      ]).toArray();
      return queryResult;
    } catch (err) { console.log(err) }
  }
  
  async textSearchDemo(collectionName, pipeline, dbName) {
    try {
      const db = dbName ? this.client.db(dbName) : this.db;
      const collection = db.collection(collectionName);
      const queryResult = await collection.aggregate(pipeline).toArray();
      return queryResult;
    } catch (err) { console.log(err) }
  }
  
  async paginate(data, page, limit) {
    const totalNumberOfPages = Math.ceil(data.length / limit);
    const currentPage = page;
    const start = (page - 1) * limit;
    const end = page * limit;
    const paginatedData = data.slice(start, end);
  
    return {
        totalNumberOfPages,
        currentPage,
        data: paginatedData
    };
  }
}
