const express = require("express");
const logger = require("morgan");
const apiRouter = require("./api");
const model = require("./database/mongo/model");
// ========================================

// ========================================

const port = process.env.PORT || 8000;

if (process.env.NODE_ENV === "development") {
  console.log("NODE_ENV = development");
  require("dotenv").config(); // eslint-disable-line
}

// ========================================

const db = model.conn;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Successfully connect to MongoDB!");
  console.log(`dbName = "${process.env.MONGO_DBNAME}"`);

  const app = express();

  if (process.env.NODE_ENV === "production") {
    console.log("Trust proxy is on");
    app.set("trust proxy", 1);
  }

  app.use(logger("dev"));
  app.use(express.static("build"));

  app.use("/api", apiRouter);

  app.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`)
  );
});
