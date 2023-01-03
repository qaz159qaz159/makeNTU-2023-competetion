// import { LaserCutterModel } from "../database/mongo/models/machine";
const Model = require("../database/mongo/models/machine");
const { ReserveLaserModel } = require("../database/mongo/models/reservation");
// const { PubSub } = require('graphql-subscriptions');
// const pubsub = new PubSub();

const Mutation = {
  // ======== 3DP ========
  createMachine: async (
    parent,
    { info: { name, type, duration } },
    { req, pubsub }
  ) => {
    // const user = await Model.UserModel.findOne({ id: req.session.userId });

    const machine = await new Model.Machine({
      name: name,
      type: type,
      status: -1,
      duration: duration,
      // user: user._id,
      completeTime: -1,
    }).save();
    console.log(machine);
    pubsub.publish("machineCreated", { machineCreated: machine });
    pubsub.publish("machineUpdated", { machineUpdated: machine });
    return machine;
  },
  clearMachine: async (parent, args, { pubsub }) => {
    await Model.Machine.deleteMany({});
    return "success";
  },
  deleteMachine: async (parent, { name }, { pubsub }) => {
    const machine = await Model.Machine.deleteOne({ name: name });
    pubsub.publish("machineDeleted", { machine: machine });
    return "success";
  },
  userReserveMachine: async (parent, { name, type }, { pubsub }) => {
    const machine = await Model.Machine.find({ type: type, status: -1 });
    if (!machine) {
      return "no machine";
    } else {
      const reserveMachine = machine[0];
      reserveMachine.status = 0;
      reserveMachine.user.push(name);
      reserveMachine.completeTime = Date.now() + reserveMachine.duration * 1000;
      await reserveMachine.save();
      pubsub.publish("UserReserveMachine", { machine: reserveMachine });
      return reserveMachine;
    }
  },
  userCancelMachine: async (parent, { name, type }, { pubsub }) => {
    const machine = await Model.Machine.find({ type: type, status: 0 });
    if (!machine) {
      return "no machine";
    } else {
      const cancelMachine = machine[0];
      cancelMachine.status = -1;
      cancelMachine.user = [];
      cancelMachine.completeTime = -1;
      await cancelMachine.save();
      pubsub.publish("UserCancelMachine", { machine: cancelMachine });
      return cancelMachine;
    }
  },

  // ======== Laser Cutter ========
  createLaserCutter: async (
    parents,
    { info: { id, status, duration, user, completeTime } },
    { pubsub }
  ) => {
    let laserCutter = await Model.LaserCutterModel.findOne({ id });
    if (!laserCutter) {
      console.log("LaserCutterModel不存在 -> 建立LaserCutterModel");
      // console.log({ id, status, duration, user, completeTime });
      laserCutter = await new Model.LaserCutterModel({
        id: id,
        status: status,
        duration: duration,
        user: user,
        completeTime: completeTime,
      }).save();
    } else {
      console.log("Find Current LaserCutter:", laserCutter.id);
    }

    console.log("Validation of LaserCutter:", laserCutter);

    pubsub.publish("CreateLaserCutter", { laserCutter: laserCutter });
    return laserCutter;
  },

  updateLaserCutter: async (
    parents,
    { info: { id, status, duration, user, completeTime } },
    { pubsub }
  ) => {
    let laserCutter = await Model.LaserCutterModel.findOneAndUpdate(
      { id },
      {
        $set: {
          status,
          duration,
          user,
          completeTime,
        },
      },
      { new: true }
    );

    if (!laserCutter) {
      console.log("Error LaserCutterModel不存在");
    } else {
      console.log("Update Current LaserCutter:", laserCutter.id);
    }
    console.log("Validation of LaserCutter:", laserCutter);
    pubsub.publish("LaserCutterInfo", { LaserCutterInfo: laserCutter });
    return laserCutter;
  },
  // delete laser cutter
  deleteLaserCutter: async (parents, { id }, { pubsub }) => {
    // Set status to '-1'.
    const laserCutter = await Model.LaserCutterModel.findOneAndUpdate(
      { id },
      {
        $set: {
          status: '-1',
        },
      },
      { new: true }
    );
    if (!laserCutter) {
      console.log("Error LaserCutterModel不存在");
    } else {
      console.log("Delete Current LaserCutter:", laserCutter.id);
    }
    console.log("Validation of LaserCutter:", laserCutter);
    pubsub.publish("LaserCutterInfo", { LaserCutterInfo: laserCutter});


    // 是不是要加pubsub? Yes

    return "success";
  },

  // ======== Reserve Laser Cutter ========

  // for reserving a laser cutter
  createLaserReserve: async (
    parents,
    { info: { teamId, material, thickness } },
    { pubsub }
  ) => {
    // 曾經預約過-> 更新reserveStatus
    let reserveLaser = await ReserveLaserModel.findOneAndUpdate(
      { teamId },
      { material, thickness, reserveStatus: 1 },
      { new: true }
    );

    // 首次預約-> 創立預約紀錄
    if (!reserveLaser) {
      reserveLaser = await new ReserveLaserModel({
        teamId,
        material,
        thickness,
      }).save();

      console.log(
        "Create new Reservation record of LaserCutter:",
        reserveLaser
      );
    } else console.log("Find Reservation record of LaserCutter:", reserveLaser);

    // console.log("Validation of LaserCutter:", reserveLaser);
    return reserveLaser;
  },

  // for canceling a laser cutter
  cancelLaserReserve: async (parents, { teamId }, { pubsub }) => {
    // 曾經預約過-> 更新reserveStatus
    let cancelLaser = await ReserveLaserModel.findOneAndUpdate(
      { teamId },
      { material: null, thickness: null, reserveStatus: 0 },
      { new: true }
    );

    if (!cancelLaser)
      console.log(`teamId ${teamId} didnt reserve a laser cutter!`);
    else console.log("Validation of cancelLaser:", cancelLaser);
    return cancelLaser;
    // console.log("Validation of LaserCutter:", reserveLaser);
  },

  // 只是測是功能用
  clearLaserReserve: async (parent, __, { pubsub }) => {
    await ReserveLaserModel.deleteMany();
    return "success";
  },
};

module.exports = Mutation;
