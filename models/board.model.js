const mongoose = require("mongoose");
const Column = require("./column.model");
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
    // cập nhật lại các column có trong columnIdsList
    const oldBoard = await Board.findById(id);

    if (columnIdsList) {
      // có thay đổi columnIdsList
      console.log("columnIdsList", columnIdsList);
      console.log("oldBoard.columnIdsList", oldBoard.columnIdsList);
      if (columnIdsList !== oldBoard.columnIdsList) {
        // column nào có trong list mới thì gán boardId=id
        columnIdsList.map(async (columnId) => {
          // await mongoose.model("Column").update(columnId, { boardId: id });
          await mongoose
            .model("Column")
            .findByIdAndUpdate(columnId, { boardId: id });
        });

        // column nào có trong list cũ nhưng không có trong list mới thì gán boardId=null
        const columnIdsListToBeNull = oldBoard.columnIdsList.filter(
          (columnId) => !columnIdsList.includes(columnId)
        );

        // if (columnIdsListToBeNull) {
        columnIdsListToBeNull.map(async (columnId) => {
          // await mongoose.model("Column").update(columnId, { boardId: null });
          await mongoose
            .model("Column")
            .findByIdAndUpdate(columnId, { boardId: null });
        });
        // }
      }
    }

    // cập nhật dữ liệu mới
    updatedBoard = await Board.findOneAndUpdate({ _id: id }, boardToUpdate, {
      new: true,
    });
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
    deletedBoard = await Board.findByIdAndDelete(id);
    if (!deletedBoard) {
      throw "This board does not exist";
    }

    // xóa tất cả các column thuộc board này -> tự động xóa các card thuộc các column đó
    deletedBoard.columnIdsList.map(async (columnId) => {
      await mongoose.model("Column").findByIdAndDelete(columnId);
      await mongoose.model("Card").deleteMany({ columnId: columnId });
    });
  } catch (err) {
    error = err;
  }

  return [deletedBoard, error];
};
module.exports = Board;
