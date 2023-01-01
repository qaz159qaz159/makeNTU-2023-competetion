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
    type: String,
    required: true,
  },
});

const Team = conn.model("User", teamSchema);

module.exports = {
  Team,
};
