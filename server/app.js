const express = require("express");
const logger = require("morgan");
const apiRouter = require("./api").router;
const loginRequired = require("./api").loginRequired;
const model = require("./database/mongo/model");
const cors = require("cors");
const json = require("body-parser").json;
const { expressMiddleware } = require("@apollo/server/express4");
// import { ApolloServer } from '@apollo/server';
const { ApolloServer } = require("@apollo/server");
// import { startStandaloneServer } from '@apollo/server/standalone';
const { startStandaloneServer } = require("@apollo/server/standalone");
// import * as fs from "fs";
const fs = require("fs");
const ApolloServerPluginDrainHttpServer =
  require("@apollo/server/plugin/drainHttpServer").ApolloServerPluginDrainHttpServer;
const http = require("http");
const Query = require("./resolvers/Query");

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
db.once("open", async () => {
  console.log("Successfully connect to MongoDB!");
  console.log(`dbName = "${process.env.MONGO_DBNAME}"`);

  const app = express();

  if (process.env.NODE_ENV === "production") {
    console.log("Trust proxy is on");
    app.set("trust proxy", 1);
  }
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs: fs.readFileSync("./server/schema.graphql", "utf-8"),
    resolvers: {
      // add other resolvers
      Query,
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: async (input) => {
      console.log("input = ", input);
      const req = input.req.headers;
      return { req };
    },
  });
  await server.start();

  app.use(logger("dev"));
  app.use(express.static("build"));

  app.use("/api", apiRouter);
  app.use("/graphql", cors(), json(), expressMiddleware(server));

  app.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`)
  );
});
