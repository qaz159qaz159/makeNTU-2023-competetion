// const { PubSub } = require('graphql-subscriptions');
// const pubsub = new PubSub();

const Subscription = {
  machineUpdated: {
    subscribe: (parent, args, { pubsub }) => {
      return pubsub.asyncIterator("machineUpdated");
    },
  },
  userUpdated: {
    subscribe: (parent, args, { pubsub }) => {
      return pubsub.asyncIterator("userUpdated");
    },
  },

  LaserCutterInfo: {
    subscribe: (parent, args, { pubsub }, info) => {
      // console.log(context);
      // console.log(pubsub.asyncIterator("LaserCutterInfo"));
      return pubsub.asyncIterator("LaserCutterInfo");
    },
  },

  // LaserCutterReservation: {
  //   subscribe(parent, teamId, { pubsub }) {
  //     return pubsub.subscribe(`LaserCutterReservation_team${teamId}`);
  //   },
  // },
};

module.exports = Subscription;
