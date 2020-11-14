const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    minlength: 6,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    minlength: 10,
  },
});

const User = mongoose.model("User", userSchema, "users");

User.get = async (query) => {
  let [users, error] = [[], null];

  try {
    users = await User.find(query);
  } catch (err) {
    console.log("Error: " + err);
    error = err;
  }
  return [users, error];
};

User.getById = async (id) => {
  let [user, error] = [null, null];

  try {
    user = await User.findById(id);
  } catch (err) {
    error = err;
  }

  return [user, error];
};

User.add = async ({ username, password, email, phone }) => {
  const userToAdd = {};
  if (username) {
    userToAdd.username = username;
  }
  if (password) {
    userToAdd.password = password;
  }
  if (email) {
    userToAdd.email = email;
  }
  if (phone) {
    userToAdd.phone = phone;
  }
  console.log("User.add: userToAdd: ", userToAdd);

  const user = new User(userToAdd);
  const newUser = await user.save();

  return newUser;
};

User.update = async (id, { username, password, email, phone }) => {
  let [updatedUser, error] = [null, null];
  const userToUpdate = {};
  if (username) {
    userToUpdate.username = username;
  }
  if (password) {
    userToUpdate.password = password;
  }
  if (email) {
    userToUpdate.email = email;
  }
  if (phone) {
    userToUpdate.phone = phone;
  }

  try {
    // update dữ liệu mới
    updatedUser = await User.findOneAndUpdate({ _id: id }, userToUpdate, {
      new: true,
    });
  } catch (err) {
    console.log("Error: " + err);
    error = err;
  }
  return [updatedUser, error];
};

User.delete = async (id) => {
  let [deletedUser, error] = [null, null];

  try {
    deletedUser = await User.findByIdAndDelete(id);

    // xóa tất cả các bảng do user này tạo
    // await mongoose.model("Board").deleteMany({ userId: deletedUser._id });
    //--
    const boards = await mongoose
      .model("Board")
      .find({ userId: deletedUser._id });

    // delete boards
    boards.map(async (board) => {
      await mongoose.model("Board").delete(board._id);
      // xóa tất cả các cột do user này tạo
      // xóa tất cả các card do user này tạo
      return board;
    });
  } catch (err) {
    error = err;
  }

  return [deletedUser, error];
};

module.exports = User;
