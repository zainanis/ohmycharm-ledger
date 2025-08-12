const express = require("express");
const connectDB = require("./config/db");
const router = require("./routes/index");
const cors = require("cors");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();
app.use(cors());

app.use(express.json());

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`server is running on localhost:${PORT}`);
});
