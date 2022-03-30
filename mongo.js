const mongoose = require("mongoose");
const password = require("./password.js");

const connectionSring = `mongodb+srv://sebastian:${password}@cluster0.4m4pz.mongodb.net/sebadb?retryWrites=true&w=majority`;

//conexion a mongodb
mongoose
  .connect(connectionSring)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    throw new Error(error.message);
  });

process.on("uncaughtException", () => {
  mongoose.connection.disconnect();
});
