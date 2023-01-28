const mongoose = require("mongoose");
const { number } = require("yargs");
require("dotenv").config();

const { MONGO_HOST, MONGO_DBNAME } = process.env;
const conn = mongoose.createConnection(
  `mongodb://${MONGO_HOST}/${MONGO_DBNAME}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// ========================================

// const courseIDs = courses.map((course) => course.id);
// const selections = {};
// courseIDs.forEach((courseID) => {
//   selections[courseID] = [String];
// });

/*user*/
const teamSchema = new mongoose.Schema({
  teamID: {
    type: String,
    required: true,
    immutable: true,
  },
  password: {
    type: String,
    required: true,
    immutable: false,
  },
  teamName: {
    type: String,
    required: true,
    immutable: false,
  },
  authority: {
    type: Number,
    required: true,
    immutable: false,
  },
  // selections,
  //image 頭像
  myCards: {
    type: Map,
    of: Number,
  },
  requests: [{ type: mongoose.Types.ObjectId, ref: "Request" }],
});

const TeamModel = conn.model("Team", teamSchema);

const requestSchema = new mongoose.Schema({
  requestID: {
    //如:team6_request_1之類
    type: String,
    required: true,
  },
  borrower: {
    //租借者，以team為單位
    type: mongoose.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  sendingTime: {
    //發送要求時間
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  requestBody: [
    {
      //提的要求
      board: { type: String }, //type: mongoose.Types.ObjectId, ref: "Board",
      quantity: { type: Number },
    },
  ],
});

const RequestModel = conn.model("Request", requestSchema);

const boardSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: { type: String },
  image: {
    //link
    type: String,
  },
  limit: {
    type: Number,
    required: true,
  },
  totalNum: {
    //一開始的所有量
    type: Number,
    required: true,
  },
  remain: {
    //剩下多少
    type: Number,
    required: true,
  },
  invoice: [
    {
      //收據!被誰借走多少
      group: { type: mongoose.Types.ObjectId, ref: "Team" },
      number: { type: Number },
    },
  ],
});

const BoardModel = conn.model("Board", boardSchema);
// ========================================

module.exports = {
  TeamModel,
  RequestModel,
  BoardModel,
  conn,
};
