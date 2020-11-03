const User = require("../models/user.model");
const userController = {};

// --- chưa refactor sang model, vẫn còn xử lý trực tiếp tại controller
userController.get = async (req, res) => {
  const query = req.query;
  try {
    const users = await User.find(query);
    res.json(users);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
};

userController.getById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

userController.add = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const phone = req.body.phone;

  try {
    const user = new User({
      username,
      password,
      email,
      phone,
    });
    console.log(user);
    await user.save();
    res.send(`Add user successfully ${user}`);
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

userController.update = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const phone = req.body.phone;

  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      username,
      password,
      email,
      phone,
    });
    console.log(user);

    res.send(`Update user successfully ${user}`);
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

userController.delete = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.send(`Delete user successfully ${user}`);
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

module.exports = userController;