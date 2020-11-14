const { Mongoose } = require("mongoose");
const User = require("../models/user.model");
const userController = {};

userController.get = async (req, res) => {
  const query = req.query;
  const [users, error] = await User.get(query);

  if (error) {
    res.status(400).json("Error: ", error);
  } else {
    res.json(users);
  }
};

userController.getById = async (req, res) => {
  const [user, error] = await User.getById(req.params.id);

  if (error) {
    res.status(400).json("Error: ", error);
  } else {
    res.json(user);
  }
};

userController.add = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const phone = req.body.phone;

  console.log("username: ", username);
  console.log("password", password);
  console.log("email", email);
  console.log("phone", phone);

  const newUser = await User.add({
    username,
    password,
    email,
    phone,
  });
  // console.log("userController.add: newUser", newUser);

  res.json(newUser);
};

userController.update = async (req, res) => {
  const id = req.params.id;
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const phone = req.body.phone;

  const [updatedUser, error] = await User.update(id, {
    username,
    password,
    email,
    phone,
  });

  if (error) {
    res.status(400).json("Error: ", error);
  } else {
    res.json(updatedUser);
  }
};

userController.delete = async (req, res) => {
  const id = req.params.id;

  const [deletedUser, error] = await User.delete(id);

  if (error) {
    res.status(400).send("Error: ", error);
  } else {
    res.json(deletedUser);
  }
};

module.exports = userController;
