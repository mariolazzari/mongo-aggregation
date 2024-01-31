const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const agg = [
  { $limit: 10 },
  {
    $addFields: {
      shipping: {
        $function: {
          body: `function(zipCode){
            switch(+zipCode[0]){
                case 0:
                case 1:
                case 2:
                    return "1 day";
                case 3:
                case 4:
                case 5:
                case 6:
                    return "2 days";
                default:
                    return "3 days"
            }
          }`,
          args: ["$address.zipCode"],
          lang: "js",
        },
      },
    },
  },
];

const run = async () => {
  try {
    const db = client.db("linkedin");
    const res = await db.collection("customers").aggregate(agg).toArray();
    console.log("Function:", res);
  } catch (ex) {
    console.log("Mongo Function error:", ex);
  } finally {
    client.close();
  }
};

run();
