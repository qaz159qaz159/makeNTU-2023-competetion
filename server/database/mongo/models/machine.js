const mongoose = require("mongoose");

const { MONGO_HOST, MONGO_DBNAME } = process.env;
const conn = mongoose.createConnection(
  `mongodb://${MONGO_HOST}/${MONGO_DBNAME}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const MachineSchema = new mongoose.Schema({
  machineName: {
    type: String,
    required: true,
  },
  machineStatus: {
    type: String,
    required: true,
  },
  machineTime: {
    type: Number,
    required: true,
  },
  machineUserID: {
    type: String,
    required: true,
  },
  machineLeftTime: {
    type: Number,
    required: true,
  },
});

const Machine = conn.model("Machine", MachineSchema);

const LaserCutterSchema = new mongoose.Schema({
  ID: { 
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  // Status 可否直接包含: removed_status
  Status: { 
    type: String, // 0: 準備中(click使用完成後), 1: 運行中(送出排程後)
    required: true,
  },
  Duration: {
    type: Number,
    required: true,
  },
  user: {
    type: String,
    required: false,
  },
  completeTime: {
    type: String,
    required: false,
  },
  // 倒數計時功能在前端呈現即可？
  // LeftTime: {
  //   type: Number,
  //   required: true,
  // },
});

const LaserCutterModel = conn.model("LaserCutter", LaserCutterSchema);


module.exports = {
  Machine,
  LaserCutterModel,
};
