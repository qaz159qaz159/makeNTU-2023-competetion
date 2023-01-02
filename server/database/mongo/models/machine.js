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
  id: { 
    type: String,
    required: true,
  },
  // status 可否直接包含: removed_status
  status: { 
    type: String, // 0: 準備中(click使用完成後), 1: 運行中(送出排程後)
    required: true,
  },
  duration: {
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
});

const LaserCutterModel = conn.model("LaserCutter", LaserCutterSchema);


module.exports = {
  Machine,
  LaserCutterModel,
};
