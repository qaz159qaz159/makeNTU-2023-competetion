const Model = require("../database/mongo/models/machine");
const { ReserveLaserModel } = require("../database/mongo/models/reservation");
const Query = {
  machine: async (parents, args, { pubsub }) => {
    const machines = await Model.Machine.find({});
    return machines;
  },

  laserCutter: async (parents, args, { pubsub }) => {
    const laser = await Model.LaserCutterModel.find().sort({ id: 1 });
    console.log(laser);
    return laser;
  },

  // laserCutterReservation: async (parents, __, { req }) => {
  //   let laserReservation = await ReserveLaserModel.find({
  //     reserveStatus: 1,
  //   }).sort({ updated_at: 1 });
  //   console.log(laserReservation);
  //   return laserReservation;
  // },
};

module.exports = Query;
