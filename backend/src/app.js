const express = require("express");

const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/users", require("./routes/users"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/dashboard", require("./routes/dashboard"));
module.exports = app;
