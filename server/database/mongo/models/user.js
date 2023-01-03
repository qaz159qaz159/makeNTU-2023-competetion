const mongoose = require("mongoose");

const { MONGO_HOST, MONGO_DBNAME } = process.env;
const conn = mongoose.createConnection(
  `mongodb://${MONGO_HOST}/${MONGO_DBNAME}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const teamSchema = new mongoose.Schema({
  teamID: {
    type: String,
    required: true,
    immutable: true,
  },
  teamName: {
    type: String,
    required: true,
    immutable: false,
  },
  status: {
    // 0: idle, 1: using, 2: finished
    type: Number,
    required: true,
  },
  machine: {
    type: [{ type: mongoose.Types.ObjectId, ref: "Machine" }],
    required: false,
  },
});

const Team = conn.model("User", teamSchema);

module.exports = {
  Team,
};
