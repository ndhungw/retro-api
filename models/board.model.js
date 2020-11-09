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
    columnIdsList: {
      type: Array,
      default: [],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Board = mongoose.model("Board", boardSchema, "boards");

Board.get = async (query) => {
  let [boards, error] = [[], null];

  try {
    boards = await Board.find(query).sort({ $natural: 1 });
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
  return newBoard;
};

Board.update = async (id, { name, columnIdsList }) => {
  let [updatedBoard, error] = [null, null];
  const boardToUpdate = {};

  if (name) {
    boardToUpdate.name = name;
  }
  if (columnIdsList) {
    boardToUpdate.columnIdsList = columnIdsList;
  }

  try {
    const board = await Board.findOneAndUpdate({ _id: id }, boardToUpdate, {
      new: true,
    });
    updatedBoard = board;
  } catch (err) {
    console.log("Error: " + err);
    error = err;
  }
  return [updatedBoard, error];
};

// DELETE
Board.delete = async (id) => {
  let [deletedBoard, error] = [null, null];

  try {
    const board = await Board.findByIdAndDelete(id);
    deletedBoard = board;
    // console.log("Board that is deleted: " + deletedBoard);
    if (!deletedBoard) {
      throw "This board does not exist";
    }
  } catch (err) {
    error = err;
  }

  return [deletedBoard, error];
};
module.exports = Board;
