const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db"); //

// Kết nối Database
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
//route
app.get("/", function (req, res) {
  res.send("bb");
});
const router = require("./routes/router");
app.use("/api", router);

module.exports = app;
