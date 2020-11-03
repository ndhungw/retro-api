const mongoose = require("mongoose");
const { Schema } = mongoose;

const boardSchema = new Schema(
  {
    name: {
      type: String,
      default: "New board",
    },
    userId: {
      type: String,
      required: true,
    },
    // showHiddenCards: {
    //     type: Boolean,
    //     default: true
    // }
  },
  {
    timestamps: true,
  }
);

const Board = mongoose.model("Board", boardSchema, "boards");

Board.get = async (query) => {
  console.log(query);
  let [boards, error] = [[], null];

  try {
    boards = await Board.find(query);
  } catch (err) {
    console.log("Error: " + err);
    error = err;
  }

  return [boards, error];
};

Board.getById = async (id) => {
  let [board, error] = [null, null];

  try {
    board = await Board.findById(id);
  } catch (err) {
    error = err;
  }

  return [board, error];
};

Board.add = async ({ name, userId }) => {
  const board = new Board({
    name,
    userId,
  });

  const newBoard = await board.save();
  return newBoard === board;
};

Board.update = async (id, { name }) => {
  let error = null;

  try {
    const board = await Board.findByIdAndUpdate(id, {
      name,
    });
  } catch (err) {
    console.log("Error: " + err);
    error = err;
  }
  return error;
};

// DELETE
Board.delete = async (id) => {
  let error = null;

  try {
    await Board.findByIdAndDelete(id);
  } catch (err) {
    error = err;
  }

  return error;
};
module.exports = Board;
