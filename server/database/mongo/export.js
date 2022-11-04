// Export team selections.

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const model = require("./model");

// ========================================

module.exports = (outputFile) => {
  if (process.env.NODE_ENV === "development") {
    console.log("NODE_ENV = development");
    require("dotenv").config();
  }
  const { MONGO_HOST, MONGO_DBNAME } = process.env;
  const teamsOutputPath = path.resolve(__dirname, "../private-data/teams.json");

  mongoose.connect(`mongodb://${MONGO_HOST}/${MONGO_DBNAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", async () => {
    console.log("Successfully connect to MongoDB!");
    console.log(`dbName = "${MONGO_DBNAME}"`);

    // Export
    const teams = await model.Team.find(
      {},
      { _id: 0, __v: 0, password: 0 }
    ).exec();
    fs.writeFileSync(teamsOutputPath, JSON.stringify(teams));
    console.log("User export finished!");

    // Disconnect
    await mongoose.disconnect();
  });
};
