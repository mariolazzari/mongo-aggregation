const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const agg = [
  {
    $group: {
      _id: "$customer.fullName",
      totalOrders: {
        $count: {},
      },
      totalItemsPurchased: {
        $sum: {
          $size: "$items",
        },
      },
      totalSpent: {
        $sum: "$total",
      },
    },
  },
];

const run = async () => {
  try {
    const db = client.db("linkedin");
    const res = await db.collection("orders").aggregate(agg).toArray();
    console.log("Aggregation 2:", res);
  } catch (ex) {
    console.log("Mongo aggregation error:", ex);
  } finally {
    client.close();
  }
};

run();
