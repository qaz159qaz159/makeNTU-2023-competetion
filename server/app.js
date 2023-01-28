const express = require("express");
const logger = require("morgan");
const apiRouter = require("./api").router;
const loginRequired = require("./api").loginRequired;
const model = require("./database/mongo/model");
const cors = require("cors");
const json = require("body-parser").json;
const { expressMiddleware } = require("@apollo/server/express4");
const { ApolloServer } = require("@apollo/server");
const fs = require("fs");
const ApolloServerPluginDrainHttpServer =
  require("@apollo/server/plugin/drainHttpServer").ApolloServerPluginDrainHttpServer;
const http = require("http");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Subscription = require("./resolvers/Subscription");
// const { PubSub } = require("graphql-subscriptions");
const pubsub = require("./pubsub");
const timer = require("./timer");

const ws = require("ws");
const wsConnect = require("./wsConnect");
const path = require("path");
// ========================================

const port = process.env.PORT || 8000;
const WSPORT = process.env.PORT || 7780;

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

  const schema = makeExecutableSchema({
    typeDefs: fs.readFileSync("./server/schema.graphql", "utf-8"),
    resolvers: {
      // add other resolvers
      Query,
      Mutation,
      Subscription,
    },
  });

  // const pubsub = new PubSub();

  const httpServer = http.createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: "/graphql",
  });

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer(
    {
      schema,
      context: { pubsub, timer },
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    context: async (input) => {
      console.log("input = ", input);
      const req = input.req.headers;
      return { req };
    },
  });

  // const { url } = await startStandaloneServer(server, {
  //   context: async() => {
  //     return{
  //       pubsub,
  //     };
  //   },
  // });

  await server.start();

  app.use(logger("dev"));
  app.use(express.static("build"));

  app.use("/api", apiRouter);
  app.use(
    "/graphql",
    cors(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ pubsub, timer }),
    })
  );

  let oldReq = await model.RequestModel.find({
    $or: [{ status: "pending" }, { status: "ready" }],
  });
  let nowTime = new Date().getTime();
  oldReq.map(async (req) => {
    if (nowTime - req.sendingTime > 15 * 60 * 1000 - 5000) {
      await model.RequestModel.updateOne(
        { _id: req._id },
        { $set: { status: "expired" } }
      );
      req.requestBody.map(async (re) => {
        await model.BoardModel.updateOne(
          { name: re.board },
          { $inc: { remain: re.quantity } }
        );
      });
    } else {
      setTimeout(
        () => wsConnect.requestExpired(req.requestID),
        15 * 60 * 1000 - (nowTime - req.sendingTime)
      );
    }
  });
  const WSServer = http.createServer(app);
  const wss = new ws.WebSocketServer({ server: WSServer });

  wss.on("connection", (ws) => {
    ws.box = ""; //記page
    ws.id = ""; //記id
    ws.authority = ""; //記authority
    ws.onmessage = wsConnect.onMessage(ws); //當ws有message時，執行後面的把丟入method
    ws.onclose = wsConnect.onClose(ws);
  });
  WSServer.listen(WSPORT, () => {
    console.log(`WS listening on ${WSPORT}`);
  });
  // app.listen(port, () =>
  //   console.log(`App listening at http://localhost:${port}`)
  // );
  httpServer.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`)
  );
});
