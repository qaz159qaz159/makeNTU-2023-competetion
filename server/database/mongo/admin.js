// Reset all data in mongodb
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const model = require("./model");

// ========================================

module.exports = (password) => {
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

    // Check if using default password
    if (password === "admin") {
      console.log(`Using default password admin! You can specufy your own.`);
    }

    // Use bcrypt to hash all passwords
    const admin = await model.Team.findOne({ teamID: "B00000000" }).exec();
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    console.log("Hashing the password...");

    // Update or Add admin data to mongodb
    if (admin === null) {
      const newAdmin = new model.Team({
        teamID: "0",
        password: hash,
        teamName: "Admin",
        authority: 1,
      });
      await newAdmin.save();
      console.log();
    } else {
      admin.password = hash;
      await admin.save();
    }

    console.log("Admin password is hashed!");

    // Disconnect
    await mongoose.disconnect();
  });
};
