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
  // ID, Name 是否合併？
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
    type: String,
    required: true,
  },
  Duration: {
    type: Number,
    required: true,
  },
  User: {
    type: String,
    required: true,
  },
  LeftTime: {
    type: Number,
    required: true,
  },
});

const LaserCutter = conn.model("LaserCutter", LaserCutterSchema);


module.exports = {
  Machine,
  LaserCutter,
};
