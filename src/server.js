require("dotenv").config();
const express = require("express");
const corn = require("node-cron");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  console.log("Cron Job Started");
  corn.schedule("* * * * *", () => {
    log();
  });
  const token = jwt.sign("token", process.env.secret);
  res.status(200).json({ "Cron Job": "Started", "Access Token": token });
});

app.get("/check", authentication, (req, res) => {
  res.status(200).json({ "Authentication Token": "Verified" });
});

function authentication(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(404).json({ "Authentication Token": "Not Found" });

  jwt.verify(token, process.env.secret, (err, data) => {
    if (err)
      return res.status(401).json({ "Authentication Token": "Unauthorized" });

    next();
  });
}

function log() {
  let today = new Date(Date.now()).toUTCString();
  console.log("The date and time is now " + today);
}

app.listen(3000, () => {
  console.log("server started");
});
