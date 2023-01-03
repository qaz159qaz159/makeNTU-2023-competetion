const Model = require("../database/mongo/models/machine");

const Query = {
  machine: async (parents, args, { req }) => {
    await Model.Machine.find({}).then((machine) => {
      console.log(machine);
      return machine;
    });
  },
};

module.exports = Query;
