const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env["MONGO_URI"], {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = mongoose.Schema({ username: String });
const exerciseSchema = mongoose.Schema({
  userid: mongoose.Types.ObjectId,
  description: String,
  duration: Number,
  date: String,
});

const User = mongoose.model("User", userSchema);
const Exercise = mongoose.model("Exercise", exerciseSchema);

const createUser = (username, done) => {
  findUserByName(username, (err, data) => {
    if (err) return done(err);
    if (data) return done(null, data);
    const userDoc = new User({ username: username });
    userDoc.save((err, data) => {
      if (err) return done(err);
      return done(null, data);
    });
  });
};

const createExercise = (userId, description, duration, date = null, done) => {
  User.findById(userId, (err, user) => {
    if (err) return done(err);
    if (!user) return done({ error: "Invalid userid" });
    if (!date) {
      date = new Date().toUTCString().split(" ").slice(0, 4).join(" ");
    } else {
      date = new Date(date);
      if (date == "Invalid Date") return done({ error: "Invalid Date" });
      date = date.toUTCString().split(" ").slice(0, 4).join(" ");
    }
    exerciseDoc = new Exercise({
      userid: userId,
      description: description,
      duration: duration,
      date: date,
    });
    exerciseDoc.save((err, exercise) => {
      if (err) return done(err);
      exercise.username = user.username;
      done(null, exercise);
    });
  });
};

const findAllExercisesByUser = (userId, done) => {
  User.findById(userId, (err, user) => {
    if (err) return done(err);
    if (!user) return done({ error: "Invalid userid" });
    Exercise.find({ userid: userId }, (err, exercises) => {
      if (err) return done(err);
      user.log = exercises;
      user.count = exercises.length;
      done(null, user);
    });
  });
};

const findAllUsers = (done) => {
  User.find((err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

const findUserByName = (username, done) => {
  User.findOne({ username: username }, (err, data) => {
    if (err) return done(err);
    return done(null, data);
  });
};

export { createUser, createUser, findAllExercisesByUser, findAllUsers, findUserByName };
