const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const agg = [
  {
    $match: {
      quantity: {
        $gt: 500,
      },
    },
  },
  {
    $addFields: {
      discount: {
        $cond: [
          {
            $lte: ["$price", 500],
          },
          0.4,
          0.65,
        ],
      },
    },
  },
  {
    $addFields: {
      soldPrics: {
        $multiply: [
          "$price",
          {
            $subtract: [1, "$discount"],
          },
        ],
      },
    },
  },
  {
    $unset: "quantity",
  },
  // save results on db collection
  {
    $out: "q4_specials",
  },
];

const run = async () => {
  try {
    const db = client.db("linkedin");
    await db.collection("products").aggregate(agg).toArray();
    const data = await db.collection("q4_specials").find().toArray();
    console.log("Aggregation 3 saved to db:", data);
  } catch (ex) {
    console.log("Mongo aggregation error:", ex);
  } finally {
    client.close();
  }
};

run();
