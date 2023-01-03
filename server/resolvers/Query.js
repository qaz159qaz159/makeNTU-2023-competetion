const Model = require("../database/mongo/models/machine");

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
};

module.exports = Query;
