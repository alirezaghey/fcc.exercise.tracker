const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("../db");
const { stat } = require("fs");
require("dotenv").config();

const app = express();
app.use(cors());
const staticPath = path.join(__dirname, "public/static");
app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: true }));

// creating a new user
app.post("/api/users", (req, res) => {
  const username = req.body["username"];
  if (!username) {
    res.status(500);
    return res.json({ error: "No username supplied!" });
  }
  db.createUser(username, (err, data) => {
    if (err) {
      res.status(500);
      console.log(err);
      return res.sendFile("err500.html", { root: staticPath });
    } else {
      return res.json(data);
    }
  });
});

// get all users
app.get("/api/users", (req, res) => {
  db.findAllUsers((err, data) => {
    if (err) {
      res.status(500);
      console.log(err);
      return res.sendFile("err500.html", { root: staticPath });
    } else {
      return res.json(data);
    }
  });
});

// creating a new exercise for the specified user
app.post("/api/users/:userid/exercises", (req, res) => {
  const userId = req.params.userid;
  const desc = req.body["description"];
  const duration = req.body["duration"];
  const date = req.body["date"];

  db.createUser(userId, desc, duration, date, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500);
      return res.sendFile("err500.html", { root: staticPath });
    } else {
      return res.json(data);
    }
  });
});

// get all exercises by userid
app.get("/api/users/:userid/logs", (req, res) => {
  const userid = req.params.userid;
  db.findAllExercisesByUser(userid, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500);
      return res.sendFile("err500.html", { root: staticPath });
    } else {
      return res.json(data);
    }
  });
});

app.listen(process.env["EXPRESS_PORT"] || 3000, () => {
  console.log(`Listening on ${process.env["EXPRESS_PORT"] || 3000}`);
});
