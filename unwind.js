const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const agg = [
  [
    {
      $unwind: {
        path: "$items",
        includeArrayIndex: "index",
      },
    },
    {
      $group: {
        _id: "$items.vendor",
        purchasees: {
          $count: {},
        },
      },
    },
    {
      $sort: {
        purchases: -1,
      },
    },
  ],
];

const run = async () => {
  try {
    const db = client.db("linkedin");
    const res = await db.collection("vendors").aggregate(agg).toArray();
    console.log("Unwind:", res);
  } catch (ex) {
    console.log("Mongo aggregation error:", ex);
  } finally {
    client.close();
  }
};

run();
