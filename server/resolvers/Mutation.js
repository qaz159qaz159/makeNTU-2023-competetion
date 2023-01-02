// import { LaserCutterModel } from "../database/mongo/models/machine";
const Model = require("../database/mongo/models/machine");


const Mutation = {
  createLaserCutter: async(parents, {info:{ id, status, duration, user, completeTime }}, { pubsub }) => {
    let laserCutter = await Model.LaserCutterModel.findOne({ id });
    if (!laserCutter){
      console.log('LaserCutterModel不存在 -> 建立LaserCutterModel');
      // console.log({ id, status, duration, user, completeTime });
      laserCutter = await new Model.LaserCutterModel({ id: id, status: status, duration: duration, user: user, completeTime: completeTime }).save();
    }
    else{
      console.log("Find Current LaserCutter:", laserCutter.id);
    }

    console.log('Validation of LaserCutter:', laserCutter);
    return laserCutter;
  },

  updateLaserCutter: async(parents, {info:{ id, status, duration, user, completeTime }}, { pubsub }) => {
    let laserCutter = await Model.LaserCutterModel.findOneAndUpdate(
      { id },
      { $set: {
          status,
          duration,
          user,
          completeTime,
        }
      },
      {new: true}
    );

    if (!laserCutter){
      console.log('Error LaserCutterModel不存在');
    }
    else{
      console.log("Update Current LaserCutter:", laserCutter.id);
    }

    console.log('Validation of LaserCutter:', laserCutter);
    return laserCutter;
  },
};

module.exports = Mutation;
