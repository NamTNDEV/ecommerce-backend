const app = require("./src/app.js");

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`Server is running at: http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  server.close(console.log("Server is closed"));
});
