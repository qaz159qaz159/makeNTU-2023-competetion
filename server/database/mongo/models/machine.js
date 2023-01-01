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

module.exports = {
  Machine,
};
