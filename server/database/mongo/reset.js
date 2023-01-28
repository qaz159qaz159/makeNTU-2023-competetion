// Reset all data in mongodb

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const model = require("./model");

// Teams with raw passwords, must be hashed later
const teamsRaw = require("../data/teams.json");

// ========================================

module.exports = () => {
  if (process.env.NODE_ENV === "development") {
    console.log("NODE_ENV = development");
    require("dotenv").config();
  }

  const SALT_ROUNDS = 10;
  const { MONGO_HOST, MONGO_DBNAME } = process.env;

  mongoose.connect(`mongodb://${MONGO_HOST}/${MONGO_DBNAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", async () => {
    console.log("Successfully connect to MongoDB!");
    console.log(`dbName = "${MONGO_DBNAME}"`);

    // Drop the db
    await db.dropDatabase();
    console.log("Database has been cleared.");

    // Use bcrypt to hash all passwords
    console.log("Hashing the passwords of all teams...");
    const teams = [];
    await Promise.all(
      teamsRaw.map(async (teamRaw) => {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hash = await bcrypt.hash(teamRaw.password, salt);
        const team = { ...teamRaw };
        team.password = hash;
        team.teamID = team.teamID.toUpperCase();
        teams.push(team);
      })
    );
    console.log("All passwords are hashed!");

    // Save all teams
    await Promise.all(
      teams.map(async (team) => {
        const teamDocument = new model.TeamModel(team);
        await teamDocument.save();
      })
    );
    console.log("All teams are saved.");

    // Disconnect
    await mongoose.disconnect();
  });
};
