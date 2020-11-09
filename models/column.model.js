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

  // thêm id vào columnIdsList trong board chứa column này
  const [board, boardError] = await Board.getById(boardId);
  await Board.update(boardId, {
    columnIdsList: [...board.columnIdsList, newColumn._id],
  });

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
    // xử lí ràng buộc dữ liệu
    const oldColumn = await Column.findById(id);

    // nếu thay đổi boardId
    if (boardId !== oldColumn.boardId) {
      // sửa columnIdsList trong board cũ và board mới
      const [oldBoard, oldBoardError] = await Board.getById(oldColumn.boardId);
      const [newBoard, newBoardError] = await Board.getById(boardId);

      // update oldBoard
      const newColumnIdsListForOldBoard = oldBoard.columnIdsList.filter(
        (columnId) => columnId != id
      );
      await Board.update(oldBoard._id, {
        columnIdsList: newColumnIdsListForOldBoard,
      });

      // update newBoard
      const newColumnIdsListForNewBoard = [...newBoard.columnIdsList, id];
      await Board.update(newBoard._id, {
        columnIdsList: newColumnIdsListForNewBoard,
      });
    }

    // nếu cardIdsList thay đổi
    if (cardIdsList !== oldColumn.cardIdsList) {
      // những card có cardId trong list cũ mà không có ở list mới thì gán columnId=null
      const cardIdsListToBeNull = oldColumn.cardIdsList.filter(
        (cardId) => !cardIdsList.includes(cardId)
      );
      cardIdsListToBeNull.map(async (cardId) => {
        await Card.update(cardId, { columnId: null });
      });
      // những card có cardId trong list mới được gán bằng id của cột này
      cardIdsList.map(async (cardId) => {
        await Card.update(cardId, { columnId: id });
      });
    }

    // update dữ liệu mới
    updatedColumn = await Column.findOneAndUpdate({ _id: id }, columnToUpdate, {
      new: true,
    });
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
    deletedColumn = await Column.findByIdAndDelete(id);

    if (!deletedColumn) {
      throw "Column does not exist";
    }

    // xóa tất cả các card thuộc column này
    deletedColumn.cardIdsList.map(async (cardId) => {
      await Card.delete(cardId);
    });

    // xóa id khỏi columnIdsList trong board chứa column này
    const [board, boardError] = await Board.getById(deletedColumn.boardId);
    await Board.update(deletedColumn.boardId, {
      columnIdsList: board.columnIdsList.filter((columnId) => columnId != id),
    });
  } catch (err) {
    error = err;
  }

  return [deletedColumn, error];
};

module.exports = Column;
