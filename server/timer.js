const pubsub = require("./pubsub");
const Model = require("./database/mongo/models/machine");

class PoolList {
  constructor(interval = 1000) {
    this.poolList = {};
    this.userMap = new Map();
    this.pubsub = pubsub;
    this.interval = interval;
    this.setIntervalID = setInterval(async () => {
      await this.check();
    }, this.interval);
  }

  addUser(username, endtime) {
    this.poolList[username] = endtime;
  }
  addPlayerMatch(key, playerData) {
    if ("id" in playerData) {
      if (!(key in this.poolList)) {
        this.poolList[key] = new Map();
      }
      if (this.poolList[key].has(playerData.id)) {
        this.poolList[key].delete(playerData.id);
      }
      this.poolList[key].set(playerData.id, {
        ...playerData,
        time: Date.now(),
      });
      this.userMap.set(playerData.id, key);
    }
  }

  deletePlayerMatch(key, id) {
    if (key in this.poolList) {
      this.poolList[key].delete(id);
      this.userMap.delete(id);
    }
    if (this.poolList[key].size === 0) {
      delete this.poolList[key];
    }
  }

  deletePlayer(id) {
    if (this.userMap.has(id)) {
      const key = this.userMap.get(id);
      this.userMap.delete(id);
      if (key in this.poolList) {
        this.poolList[key].delete(id);
        if (this.poolList[key].size === 0) {
          delete this.poolList[key];
        }
      }
    }
  }

  async check() {
    const keys = Object.keys(this.poolList);
    for (let i = 0; i < keys.length; i++) {
        if (this.poolList[keys[i]] < Date.now()) {
          const machine = await Model.Machine.findOne({name: keys[i]});
          machine.status = -1;
          machine.user = null;
          machine.completeTime = -1;
          await machine.save();
          delete this.poolList[keys[i]];
          const machines = await Model.Machine.find({});
          this.pubsub.publish("machineUpdated", {machineUpdated: machines});
          await Team.deleteOne({machine: keys[i]});
          const users = await Team.find({});
          this.pubsub.publish("userUpdated", {userUpdated: users});
        }
    }
  }
}

const isMatch = (p1, p2) => {
  return p1 !== p2;
};

const pool = new PoolList();

export default pool;
