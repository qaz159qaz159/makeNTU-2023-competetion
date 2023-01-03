const Model = require("../database/mongo/models/machine");
const { ReserveLaserModel } = require("../database/mongo/models/reservation");
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const Mutation = {
  createLaserCutter: async (
    parents,
    { info: { id, status, duration, user, completeTime } },
    // { pubsub }
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
    return laserCutter;
  },

  updateLaserCutter: async (
    parents,
    { info: { id, status, duration, user, completeTime } },
    // { pubsub }
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
    console.log(pubsub.publish('LaserCutterInfo', { newInfo: laserCutter }));
    pubsub.publish('LaserCutterInfo', { LaserCutterInfo: laserCutter });
    return laserCutter;
  },

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
};

module.exports = Mutation;
