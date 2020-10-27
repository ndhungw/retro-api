const mongoose = require("mongoose");
const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dqfsn.gcp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
      // we're connected!
      console.log("Connect to database successfully");
    });
  }

  // _connect() {
  //   mongoose
  //     .connect(DB_URI, {
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //       useCreateIndex: true,
  //     })
  //     .then(() => {
  //       console.log("MongoDB database connection established successfully!");
  //     })
  //     .catch((err) => {
  //       console.log("MongoDB database connection error!");
  //     });
  // }
}

module.exports = new Database();
