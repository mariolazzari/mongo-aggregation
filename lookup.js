const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const agg = [
  {
    $lookup: {
      from: "products",
      localField: "items",
      foreignField: "_id",
      as: "items",
    },
  },
];

const run = async () => {
  try {
    const db = client.db("linkedin");
    const res = await db.collection("vendors").aggregate(agg).toArray();
    console.log("Vendors products lookup:", res);
  } catch (ex) {
    console.log("Mongo aggregation error:", ex);
  } finally {
    client.close();
  }
};

run();
