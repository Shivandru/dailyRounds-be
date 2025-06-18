const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connection = require("./config/db");
const PORT = process.env.PORT || 8080;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    // httpOnly: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/dailyRounds/api/users", require("./routes/userRoute"));
app.use("/dailyRounds/api/todos", require("./routes/todoRoute"));

app.use("/", (req, res) => {
  res.send(`Welcome to Todo App`);
});
app.listen(PORT, async () => {
  await connection;
  console.log("Server running on port: ", PORT);
});
