const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const agg = [
  {
    $group: {
      _id: "$customer._id",
      summary: {
        $accumulator: {
          init: `function(){
                    return { orders: 0, sum: 0 }
                }`,
          accumulate: `function(state, total){
                    return { orders: state.orders + 1 ,
                             sum: state.sum + total 
                            }
                }`,
          accumulateArgs: ["$total"],
          merge: `function(state1, state2){ 
            return {
                orders: state1.count + state2.count,
                sum: state1.sum + state2.sum
            }
          }`,
          finalize: `function(state){ 
            if(state.sum > 5000){
              return {
                orders: state.orders,
                sum: state,
                vip: true
                }
            } else{
                 return {
                orders: state.orders,
                sum: state,
                vip: false
                }
            }
          }`,
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
    console.log("Accumulator:", res);
  } catch (ex) {
    console.log("Mongo Accumulator error:", ex);
  } finally {
    client.close();
  }
};

run();
