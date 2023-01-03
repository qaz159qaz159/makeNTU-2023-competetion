// const { PubSub } = require('graphql-subscriptions');
// const pubsub = new PubSub();

const Subscription = {
  // machine: {
  //   subscribe(parent, { machineId }, { pubsub }) {
  //     return pubsub.subscribe(`machine`);
  //   },
  // },

  // 不是很確定要怎麼寫TT
  // 因為無法測試所以高機率我在亂寫QQ
  // err msg from apollo sandbox: "server must support graphql-ws or subscriptions-transport-ws protocol"
  LaserCutterInfo: {
    subscribe: (parent, args, {pubsub}, info) => {
      // console.log(context);
      console.log(pubsub.asyncIterator('LaserCutterInfo'));
      return pubsub.asyncIterator('LaserCutterInfo');
    },
  },

  // LaserCutterReservation: {
  //   subscribe(parent, teamId, { pubsub }) {
  //     return pubsub.subscribe(`LaserCutterReservation_team${teamId}`);
  //   },
  // },
};

module.exports = Subscription;
