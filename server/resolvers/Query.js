const Model = require("../database/mongo/models/machine");

const Query = {
  machine: async (parents, args, { req }) => {
    await Model.Machine.find({}).then((machine) => {
      console.log(machine);
      return machine;
    });
  },

  laserCutter: async (parents, __, { req }) => {
    let laser = await Model.LaserCutterModel.find().sort({ id: 1 });
    console.log(laser);
    return laser;
  },
};

module.exports = Query;
