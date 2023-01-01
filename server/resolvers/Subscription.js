const Subscription = {
  machine: {
    subscribe(parent, { machineId }, { pubsub }) {
      return pubsub.subscribe(`machine`);
    },
  },
};
export default Subscription;
