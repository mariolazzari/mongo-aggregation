const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const agg = [
  { $match: { "customer.address.state": "CA" } },
  { $sort: { total: -1 } },
  { $limit: 5 },
];

const run = async () => {
  try {
    const db = client.db("linkedin");
    const res = await db.collection("orders").aggregate(agg).toArray();
    console.log("Aggregation 1:", res);
  } catch (ex) {
    console.log("Mongo aggregation error:", ex);
  } finally {
    client.close();
  }
};

run();
