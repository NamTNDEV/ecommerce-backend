const { default: mongoose } = require("mongoose");
const os = require("os");
const process = require("process");

const SECONDS = 5000;

// Counting number of connections
const countingConnections = () => {
  const counter = mongoose.connections.length;
  console.log("Number of connections: " + counter);
};

//Check over load
const checkingOverload = () => {
  setInterval(() => {
    const numConnections =
      mongoose.connection.readyState === 1 ? mongoose.connections.length : 0;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    //Example The maximum number of connections base on the number of cores
    const maxConnections = numCores * 5;

    console.log(`Active connections: ${numConnections}`);
    console.log(`Memory usage: ${(memoryUsage / 1024 / 1024).toFixed(3)} MB`);

    if (numConnections > maxConnections) {
      console.log("Connection overload detected!");
    }
  }, SECONDS); //Monitor every 5 seconds;
};

module.exports = {
  countingConnections,
  checkingOverload,
};
