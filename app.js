const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./Routes/userRoutes");

const globalErrorHandler = require("./Controllers/errorController");

dotenv.config({ path: "./.env" });

const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);
app.use(globalErrorHandler);

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

//Unhandled errors
process.on("unhandledRejection", err => {
  console.log(err.name, err.message);
  console.log("UNHADLED REJECTION");
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", err => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION");
  server.close(() => {
    process.exit(1);
  });
});
