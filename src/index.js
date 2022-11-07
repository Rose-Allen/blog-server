const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("./models/Post");
require("./models/User");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_CONNECTION_URL);

mongoose.connection.on("connected", () => {
  console.log("connected to db");
});

app.use("/posts", require("./routes/posts"));

app.use("/auth", require("./routes/auth"));

// app.post("/posts", (req, res) => {});

// app.delete("/posts:id", (req, res) => {});
const PORT = process.env.PORT ?? 3004;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
