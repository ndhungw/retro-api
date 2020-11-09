const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Board = require("../models/board.model");
const Card = require("../models/card.model");

const columnSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      default: "New col",
    },
    boardId: {
      type: String,
      required: true,
    },
    cardIdsList: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Column = mongoose.model("Column", columnSchema, "columns");

Column.get = async (query) => {
  let [columns, error] = [[], null];

  try {
    columns = await Column.find(query);
  } catch (err) {
    console.log("Error: " + err);
    error = err;
  }
  return [columns, error];
};

Column.getById = async (id) => {
  let [column, error] = [null, null];

  try {
    column = await Column.findById(id);
  } catch (err) {
    error = err;
  }

  return [column, error];
};

Column.add = async ({ name, boardId }) => {
  const columnToAdd = {};
  if (name) {
    columnToAdd.name = name;
  }
  if (boardId) {
    columnToAdd.boardId = boardId;
  }

  const column = new Column(columnToAdd);

  const newColumn = await column.save();

  // // thêm id vào columnIdsList trong board chứa column này
  // const board = await Board.findById(boardId);
  // await Board.findOneAndUpdate(
  //   { _id: boardId },
  //   {
  //     columnIdsList: [...board.columnIdsList, newColumn._id],
  //   }
  // );

  return newColumn;
};

Column.update = async (id, { name, boardId, cardIdsList }) => {
  let [updatedColumn, error] = [null, null];
  const columnToUpdate = {};
  if (name) {
    columnToUpdate.name = name;
  }
  if (boardId) {
    columnToUpdate.boardId = name;
  }
  if (cardIdsList) {
    columnToUpdate.cardIdsList = cardIdsList;
  }

  try {
    const column = await Column.findOneAndUpdate({ _id: id }, columnToUpdate, {
      new: true,
    });
    updatedColumn = column;
  } catch (err) {
    console.log("Error: " + err);
    error = err;
  }
  return [updatedColumn, error];
};

// DELETE
Column.delete = async (id) => {
  let [deletedColumn, error] = [null, null];

  try {
    // xóa cột
    const column = await Column.findByIdAndDelete(id);
    deletedColumn = column;
    // const boardId = deletedColumn.boardId;
    // console.log("deletedColumn.boardId: ", boardId);

    if (!deletedColumn) {
      throw "Column does not exist";
    }

    // // xóa tất cả các card thuộc column này
    // deletedColumn.cardIdsList.map(async (cardId) => {
    //   await Card.findByIdAndDelete(cardId);
    // });

    // // xóa id khỏi columnIdsList trong board chứa column này
    // const board = await Board.findById(boardId);
    // await Board.findOneAndUpdate(
    //   { _id: boardId },
    //   {
    //     columnIdsList: board.columnIdsList.filter((columnId) => columnId != id),
    //   }
    // );
  } catch (err) {
    error = err;
  }

  return [deletedColumn, error];
};

module.exports = Column;
