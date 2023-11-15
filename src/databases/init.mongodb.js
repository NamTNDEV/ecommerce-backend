const mongoose = require("mongoose");

const connectString = "mongodb://localhost:27017/ecommerceBE";

class Database {
  constructor() {
    this.connect();
  }

  //Connect Function:
  connect(type = "mongodb") {
    if (true) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString, { maxPoolSize: 50 })
      .then(() => {
        console.log("Connecting to MongoDB Successfully!");
      })
      .catch((err) => console.log("Connection Failed!"));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
