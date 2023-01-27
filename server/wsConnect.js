const model = require("./database/mongo/model");
//import { TeamModel, RequestModel, BoardModel} from "./database/mongo/model";

const teamID = {}; //記ws是哪個group => 給需要呼叫該組時
const userAuth = {}; //記ws的authority => 給需要更新data時
const userPage = {}; //記ws現在在哪個page => 給需要更新data時

const sendData = (data, ws) => {
  ws.send(JSON.stringify(data));
};

const sendStatus = (payload, ws) => {
  sendData(["status", payload], ws);
};

const broadcastPage = (page, data) => {
  //// console.log(userPage[page]);
  if (userPage[page]) {
    userPage[page].forEach((client) => {
      sendData(data, client);
    });
  }
};
const broadcastID = (ID, data) => {
  //// console.log(userPage[page]);
  if (teamID[ID]) {
    teamID[ID].forEach((client) => {
      sendData(data, client);
    });
  }
};
const broadcastAuth = (authority, data) => {
  //// console.log(userPage[page]);
  if (userAuth[authority]) {
    userAuth[authority].forEach((client) => {
      sendData(data, client);
    });
  }
};
const getIntersection = (setA, setB) => {
  if (!setA) return setB;
  if (!setB) return setA;
  const intersection = new Set(
    [...setA].filter((element) => setB.has(element))
  );

  return intersection;
};
const broadcast = (condictions, data) => {
  const { id, authority, page } = condictions;
  const IdSet = id ? teamID[id] : undefined;
  const AuthSet = authority ? userAuth[authority] : undefined;
  const PageSet = page ? userPage[page] : undefined;
  let validSet = getIntersection(getIntersection(IdSet, AuthSet), PageSet);
  if (!id && !authority && !page) {
    validSet = [];
    for (const [key, value] of Object.entries(teamID)) {
      validSet = [...validSet, ...value];
    }
    for (const [key, value] of Object.entries(userAuth)) {
      validSet = [...validSet, ...value];
    }
    for (const [key, value] of Object.entries(userPage)) {
      validSet = [...validSet, ...value];
    }
    validSet = new Set(validSet);
  }
  if (!validSet) return;
  validSet.forEach((client) => {
    sendData(data, client);
  });
};
const changeBoardRemain = async (req) => {
  try {
    await Promise.all(
      req.requestBody.map(async (re) => {
        await model.BoardModel.updateOne(
          { name: re.board },
          { $inc: { remain: re.quantity } }
        );
      })
    );
  } catch (e) {
    throw new Error("Message DB save error: " + e);
  }
  const newBoard = await model.BoardModel.find({});
  broadcast({ page: "userProgress" }, ["AddBoard", newBoard]);
  const teams = await model.TeamModel.find({}).populate("requests");
  broadcast({ page: "userProgress" }, ["GETUSER", teams]);
};

const requestExpired = async (id, status) => {
  let request = await model.RequestModel.findOne({ requestID: id });
  if (!request) return;
  if (request.status === status) {
    await model.RequestModel.updateOne(
      { requestID: id },
      { $set: { status: "expired" } }
    );
    await changeBoardRemain(request);
    broadcast({ id: request.borrower.teamID }, [
      "status",
      ["error", "One Request Expired :("],
    ]);
  }
  return;
};

const updateMyCards = async (group, request) => {
  let gp = await model.TeamModel.findOne({ teamID: group });

  await Promise.all(
    request.map(async (e) => {
      (await gp.myCards.has(e.board))
        ? await gp.myCards.set(e.board, gp.myCards.get(e.board) + e.quantity)
        : await gp.myCards.set(e.board, e.quantity);
    })
  );
  await gp.save();
  // // console.log(gp.myCards);
  //// console.log(gp, "hi");
};

module.exports = {
  requestExpired: async (id, status) => {
    let request = await model.RequestModel.findOne({ requestID: id }).populate([
      "borrower",
    ]);
    if (!request) return;
    if (request.status === status) {
      await model.RequestModel.updateOne(
        { requestID: id },
        { $set: { status: "expired" } }
      );

      await changeBoardRemain(request);
      broadcast({ id: request.borrower.teamID }, [
        "status",
        ["error", "One Request Expired :("],
      ]);
    }
    return;
  },
  onMessage: (ws) => async (byteString) => {
    const { data } = byteString;
    const [task, payload] = JSON.parse(data);
    console.log(task, payload);

    switch (task) {
      case "RESETDATABASE": {
        console.log("Reseting...");
        await model.BoardModel.deleteMany({});
        await model.RequestModel.deleteMany({});
        await model.TeamModel.updateMany(
          {},
          { $set: { myCards: new Map(), requests: [] } }
        );
        console.log("Database has been cleared.");

        const userData = await model.TeamModel.find({});
        userData.map((user) => {
          broadcast({ id: user.teamID }, ["GETUSER", user]);
        });
        broadcastPage("userProgress", ["AddBoard", []]);
        broadcast({ authority: 1 }, ["GETBOARD", []]);
        broadcast({ page: "requestStatus" }, ["UPDATEREQUEST", []]);
        broadcast({ page: "requestStatus" }, ["UPDATERETURN", userData]);
        console.log("All Change has been sent.");

        break;
      }
      case "SUBSCRIBE": {
        const { id, authority, page } = payload;
        //userStatus & userProgress & adminBoardList
        if (userPage[ws.box]) userPage[ws.box].delete(ws);
        if (teamID[ws.id]) teamID[ws.id].delete(ws);
        if (userAuth[ws.authority]) userAuth[ws.authority].delete(ws);

        if (!userPage[page]) userPage[page] = new Set();
        userPage[page].add(ws);
        ws.box = page;
        // // console.log("change page to " + ws.box);

        if (!teamID[id]) teamID[id] = new Set();
        teamID[id].add(ws);
        ws.id = id;

        if (!userAuth[authority]) userAuth[authority] = new Set();
        userAuth[authority].add(ws);
        ws.authority = authority;

        // console.log(id, authority);
        // console.log("change page to " + ws.box);
        break;
      }
      case "DELETEREQUESTFROMUSER": {
        let userData = await model.TeamModel.findOne({ teamID: payload[0] });

        let newRequest = userData.requests;
        const newR = newRequest.filter(
          (re) => String(re._id) !== String(payload[1])
        );
        // // console.log("newR:", newR);
        // // console.log("newRequest:", newRequest);
        await model.TeamModel.updateOne(
          { teamID: payload[0] },
          { $set: { requests: newR } }
        );
        userData = await model.TeamModel.findOne({ teamID: payload[0] });
        await userData.populate("requests").execPopulate();
        await userData.save();
        broadcast({ id: userData.teamID, authority: 0, page: "userStatus" }, [
          "GETUSER",
          userData,
        ]);
        break;
      }
      case "CANCELREQUEST": {
        let userData = await model.TeamModel.findOne({ teamID: payload[0] });
        await model.RequestModel.updateOne(
          { _id: payload[1] },
          { $set: { status: "cancel" } }
        );
        let request = await model.RequestModel.findById(payload[1]);
        await changeBoardRemain(request);
        await userData.populate("requests").execPopulate();
        broadcast({ id: userData.teamID, authority: 0, page: "userStatus" }, [
          "GETUSER",
          userData,
        ]);
        broadcast({ id: userData.teamID, authority: 0, page: "userProgress" }, [
          "GETUSER",
          userData,
        ]);
        const requests = await model.RequestModel.find().populate(["borrower"]);
        broadcast({ authority: 1, page: "requestStatus" }, [
          "UPDATEREQUEST",
          requests,
        ]);
        break;
      }
      case "GETUSER": {
        let userData = await model.TeamModel.findOne({ teamID: payload });
        console.log(userData, payload);
        await userData.populate("requests").execPopulate();
        sendData(["GETUSER", userData], ws);
        // sendStatus(["success", "Get successfully"], ws);
        break;
      }
      case "INITUSERCARD": {
        const boards = await model.BoardModel.find({});
        sendData(["INITUSERCARD", boards], ws);
        // sendStatus(["success", "Get successfully"], ws);
        break;
      }
      case "ADDBOARD": {
        const newData = payload;
        // console.log("AddBoard:", newData);
        const existing = await model.BoardModel.find({
          name: newData.name,
        });
        if (existing.length !== 0) {
          sendStatus(["error", `${newData.name} already exist.`], ws);
          break;
        }
        try {
          const temp = await new model.BoardModel(payload).save();
          const newBoard = await model.BoardModel.find({});
          broadcastPage("adminBoardList", ["AddBoard", newBoard]);
          broadcastPage("userProgress", ["AddBoard", newBoard]);
          sendStatus(["success", "Add successfully"], ws);
        } catch (e) {
          throw new Error("Board DB save error: " + e);
        }
        break;
      }
      case "UPDATEBOARDS": {
        const newData = payload;
        try {
          await Promise.all(
            newData.map(
              async (board) =>
                await model.BoardModel.replaceOne(
                  {
                    name: board.name,
                  },
                  { ...board, remain: board.totalNum },
                  { upsert: true }
                )
            )
          );
          sendStatus(["success", "Update successfully"], ws);
          const boards = await model.BoardModel.find({});
          sendData(["UpdateBoard", { status: "success", data: boards }], ws);
          broadcastPage("userProgress", ["AddBoard", boards]);
          broadcastPage("adminBoardList", ["AddBoard", boards]);
        } catch (e) {
          throw new Error("Board DB update error: " + e);
        }
        break;
      }
      case "DELETEBOARD": {
        const newDataID = payload;
        const existing = await model.BoardModel.deleteOne({
          id: newDataID,
        });
        const boards = await model.BoardModel.find({});
        broadcastPage("userProgress", ["AddBoard", boards]);
        broadcast({ page: "adminBoardList" }, ["GETBOARD", boards]);
        sendStatus(["success", "Delete successfully"], ws);
        break;
      }
      case "GETBOARD": {
        const boards = await model.BoardModel.find({});
        // // console.log(boards);
        sendData(["GETBOARD", boards], ws);
        //sendStatus(["success", "Get successfully"], ws);
        break;
      }
      case "GETREQUEST": {
        //need populate
        const requests = await model.RequestModel.find().populate(["borrower"]);
        // await requests..execPopulate();
        // // console.log(requests);
        sendData(["GETREQUEST", requests], ws);
        // sendStatus(["success", "Get successfully"], ws);
        break;
      }
      case "REQUEST": {
        let { group, requestBody } = payload;
        let gp = await model.TeamModel.findOne({ teamID: group });
        let count = await model.RequestModel.countDocuments({
          borrower: gp,
        });
        let boardMissing = false;
        let numNotSatisfy = false;
        await Promise.all(
          requestBody.map(async (board) => {
            const myboard = await model.BoardModel.findOne({
              name: board[0],
            });
            if (!myboard) {
              // console.log("Board missing:", board, myboard);
              boardMissing = true;
              return;
            }
            if (myboard.remain - board[1] < 0) {
              numNotSatisfy = true;
            }
          })
        );
        if (numNotSatisfy) {
          sendData(
            [
              "USERPROGRESSSTATUS",
              [
                `Request Failed !`,
                `Some Boards are not enough for your request . Please Reselect Again!`,
              ],
            ],
            ws
          );
          break;
        }
        if (boardMissing) {
          sendData(
            [
              "USERPROGRESSSTATUS",
              [
                `Request Failed !`,
                `Some Boards Missing. Please Refresh Page Again!`,
              ],
            ],
            ws
          );
          break;
        }
        let body = requestBody.map((e) => {
          return { board: e[0], quantity: e[1] };
        });

        const request = new model.RequestModel({
          requestID: "Group" + group + "_request" + (count + 1),
          borrower: gp,
          sendingTime: new Date().getTime(),
          status: "pending",
          requestBody: body,
        });
        setTimeout(
          () =>
            requestExpired(
              "Group" + group + "_request" + (count + 1),
              "pending"
            ),
          15 * 60 * 1000
        );
        try {
          await request.save();
        } catch (e) {
          // throw new Error("Request DB save error: " + e);
          sendData(["USERPROGRESSSTATUS", [`Request Failed !`, `${e}`]], ws);
        }
        await model.TeamModel.updateMany(
          { teamID: group },
          { $push: { requests: request } }
        );
        const requests = await model.RequestModel.find().populate(["borrower"]);
        // // console.log(requests);
        await Promise.all(
          request.requestBody.map(async (board) => {
            const myboard = await model.BoardModel.updateOne(
              {
                name: board.board,
              },
              { $inc: { remain: -board.quantity } }
            );
            // myboard.remain -= board.quantity;
          })
        );
        broadcastAuth(1, ["status", ["success", "New Request come in!"]]);
        broadcast({ authority: 1, page: "requestStatus" }, [
          "UPDATEREQUEST",
          requests,
        ]);
        // sendStatus(["success", "Request successfully"], ws);
        sendData(["USERPROGRESSSTATUS", [`Request successfully !`]], ws);
        const boards = await model.BoardModel.find({});
        broadcast({ page: "userProgress" }, ["INITUSERCARD", boards]);
        broadcast({ page: "adminBoardList" }, ["GETBOARD", boards]);

        let userData = await model.TeamModel.findOne({ teamID: group });
        await userData.populate("requests").execPopulate();
        broadcast({ id: group }, ["GETUSER", userData]);
        break;
      }
      case "UPDATEREQ": {
        const { requestID, requestStatus } = payload;
        await model.RequestModel.updateOne(
          { _id: requestID },
          { $set: { status: requestStatus } }
        );
        const newReq = await model.RequestModel.findOne({
          _id: requestID,
        }).populate(["borrower"]);
        // // console.log(newReq);

        if (requestStatus === "ready") {
          await model.RequestModel.updateOne(
            { _id: requestID },
            {
              $set: {
                status: requestStatus,
                sendingTime: new Date().getTime(),
              },
            }
          );
          setTimeout(
            () => requestExpired(newReq.requestID, "ready"),
            15 * 60 * 1000
          );
          broadcast({ id: newReq.borrower.teamID }, [
            "status",
            ["success", "Request Ready!!"],
          ]);
        }
        if (requestStatus === "solved") {
          await updateMyCards(newReq.borrower.teamID, newReq.requestBody);
          await Promise.all(
            newReq.requestBody.map(async (board) => {
              const myboard = await model.BoardModel.findOne({
                name: board.board,
              });
              let found = false;
              let newInvoice = myboard.invoice.map((item) => {
                if (String(newReq.borrower._id) === String(item.group)) {
                  found = true;
                  return {
                    group: item.group,
                    number: item.number + board.quantity,
                  };
                } else {
                  return item;
                }
              });
              if (!found) {
                newInvoice = [
                  ...myboard.invoice,
                  { group: newReq.borrower._id, number: board.quantity },
                ];
              }
              // // console.log("newInvoice: ", board, newInvoice);
              myboard.invoice = newInvoice;
              // myboard.remain -= board.quantity;
              await myboard.save();
            })
          );
          const boards = await model.BoardModel.find({});
          // console.log(boards);
        }
        const requests = await model.RequestModel.find().populate(["borrower"]);
        // sendData(["UPDATEREQUEST", requests], ws);
        broadcast({ authority: 1, page: "requestStatus" }, [
          "UPDATEREQUEST",
          requests,
        ]);
        const userData = await model.TeamModel.findOne({
          teamID: newReq.borrower.teamID,
        }).populate(["requests"]);
        broadcast(
          { id: newReq.borrower.teamID, authority: 0, page: "userStatus" },
          ["GETUSER", userData]
        );
        if (requestStatus === "solved") {
          broadcast({ id: newReq.borrower.teamID }, [
            "status",
            ["success", "Boards have taken!!"],
          ]);
        } // broadcast
        if (requestStatus === "denied") {
          broadcast({ id: newReq.borrower.teamID }, [
            "status",
            ["error", "Sorry Request Denied :("],
          ]);
          // broadcast({ id: newReq.borrower.teamID }, ["GETUSER", userData]);
          changeBoardRemain(newReq);
        } // broadcast
        if (requestStatus === "cancel") {
          changeBoardRemain(newReq);
        } // broadcast
        sendStatus(["success", "Update successfully"], ws);
        break;
      }
      case "UPDATERETURN": {
        const { id, returned } = payload;
        // console.log(id, returned);
        const team = await model.TeamModel.findOne({ teamID: id }).populate([
          "requests",
        ]);
        const teamsCard = JSON.parse(JSON.stringify(team.myCards));
        // console.log(teamsCard);
        for (const [key, value] of Object.entries(returned)) {
          if (value === 0) continue;
          teamsCard[key] -= value;
          const myboard = await model.BoardModel.findOne({
            name: key,
          });
          myboard.remain += value;
          const newInvoice = myboard.invoice.map((item) => {
            if (String(item.group) === String(team._id))
              return { group: item.group, number: item.number - value };
            else return item;
          });
          myboard.invoice = newInvoice.filter((item) => item.number > 0);
          // // console.log(myboard.invoice);
          await myboard.save();
          // // console.log(myboard.invoice);
          if (teamsCard[key] === 0) delete teamsCard[key];
        }
        team.myCards = teamsCard;
        await team.save();
        // // console.log(team.myCards);
        const teams = await model.TeamModel.find({});

        broadcast({ id: id, authority: 0, page: "userStatus" }, [
          "GETUSER",
          team,
        ]);
        const boards = await model.BoardModel.find({});

        broadcast({ page: "userProgress" }, ["AddBoard", boards]);
        broadcast({ authority: 1, page: "requestStatus" }, [
          "UPDATERETURN",
          teams,
        ]);
        // sendData(["UPDATERETURN", teams], ws);
        sendStatus(["success", "Update successfully"], ws);
        break;
      }
      case "REPLACEBOARD": {
        await model.BoardModel.deleteMany({});
        await model.RequestModel.deleteMany({});
        await model.TeamModel.updateMany(
          { authority: 0 },
          { $set: { myCards: {}, request: [] } }
        );

        // console.log(payload);
        const newBoards = await Promise.all(
          payload.map(async (newBoard) => {
            const saveBoard = await new model.BoardModel(newBoard).save();
            return saveBoard;
          })
        );
        // sendData(["GETBOARD", newBoards], ws);
        broadcastPage("adminBoardList", ["GETBOARD", newBoards]);
        broadcastPage("userProgress", ["AddBoard", newBoards]);
        //sendStatus(["success", "Reset successfully"], ws);
        break;
      }
    }
  },
  onClose: (ws) => async () => {
    console.log(
      `ws of id:${ws.id},auth:${ws.authority},page:${ws.box} is closing...`
    );
    if (userPage[ws.box]) userPage[ws.box].delete(ws);
    if (teamID[ws.id]) teamID[ws.id].delete(ws);
    if (userAuth[ws.authority]) userAuth[ws.authority].delete(ws);
  },
};
