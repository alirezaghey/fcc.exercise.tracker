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
    if (!user) return done(null, { error: "Invalid userid" });
    if (!date) {
      date = new Date().toDateString();
    } else {
      date = new Date(date);
      if (date == "Invalid Date") return done({ error: "Invalid Date" });
      date = date.toDateString();
    }
    exerciseDoc = new Exercise({
      userid: userId,
      description: description,
      duration: duration,
      date: date,
    });
    exerciseDoc.save((err, exercise) => {
      if (err) return done(err);
      const result = {
        _id: user._id,
        username: user.username,
        date: exercise.date,
        duration: exercise.duration,
        description: exercise.description,
      };
      done(null, result);
    });
  });
};

const findAllExercisesByUser = (userId, done) => {
  User.findById(userId, (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, { error: "Invalid userid" });
    Exercise.find({ userid: userId }, (err, exercises) => {
      if (err) return done(err);
      const res = {
        _id: user._id,
        username: user.username,
        log: exercises,
        count: exercises.length,
      };
      done(null, res);
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

module.exports = {
  createUser,
  createExercise,
  findAllExercisesByUser,
  findAllUsers,
  findUserByName,
};
