const Model = require("../database/mongo/models/machine");

const Query = {
  machine: async (parents, args, { pubsub }) => {
    await Model.Machine.find({}).then((machine) => {
      console.log(pubsub);
      return machine;
    });
  },

  laserCutter: async (parents, __, { req }) => {
    let laser = await Model.LaserCutterModel.find().sort({ id: 1 });
    console.log(laser);
    return laser;
    }
  };

module.exports = Query;
