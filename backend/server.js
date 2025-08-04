const express = require("express");
const connectDB = require("./config/db");
const router = require("./routes/index");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "Hello this is a test" });
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`server is running on localhost:${PORT}`);
});
