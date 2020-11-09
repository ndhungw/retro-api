const Column = require("../models/column.model");
const columnController = {};
const Board = require("../models/board.model");
const Card = require("../models/card.model");

columnController.get = async (req, res) => {
  const query = req.query;
  const [columns, error] = await Column.get(query);

  if (error) {
    res.status(400).json("Error: " + error);
  } else {
    res.json(columns);
  }
};

columnController.getById = async (req, res) => {
  const [column, error] = await Column.getById(req.params.id);

  if (error) {
    res.status(400).json("Error: " + error);
  } else {
    res.json(column);
  }
};

columnController.add = async (req, res) => {
  const name = req.body.name;
  const boardId = req.body.boardId;

  const newColumn = await Column.add({
    name,
    boardId,
  });

  // thêm id vào columnIdsList trong board chứa column này
  const [board, boardError] = await Board.getById(boardId);
  await Board.update(boardId, {
    columnIdsList: [...board.columnIdsList, newColumn._id],
  });

  res.json(newColumn);
};

columnController.update = async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const boardId = req.body.boardId;
  const cardIdsList = req.body.cardIdsList;

  const [updatedColumn, error] = await Column.update(id, {
    name,
    boardId,
    cardIdsList,
  });

  // sửa columnIdsList trong board cũ và board mới
  const [oldBoard, oldBoardError] = await Board.getById(updatedColumn.boardId);
  const [newBoard, newBoardError] = await Board.getById(boardId);

  const newColumnIdsListForOldBoard = oldBoard.columnIdsList.filter(
    (columnId) => columnId != id
  );
  const newColumnIdsListForNewBoard = [...newBoard.columnIdsList, id];

  await Board.update(oldBoard._id, {
    columnIdsList: newColumnIdsListForOldBoard,
  });
  await Board.update(newBoard._id, {
    columnIdsList: newColumnIdsListForNewBoard,
  });

  if (error) {
    res.status(400).json("Error: " + error);
  } else {
    res.json(updatedColumn);
  }
};

columnController.delete = async (req, res) => {
  const id = req.params.id;

  const [deletedColumn, error] = await Column.delete(id);

  // xóa tất cả các card thuộc column này
  deletedColumn.cardIdsList.map(async (cardId) => {
    await Card.delete(cardId);
  });

  // xóa id khỏi columnIdsList trong board chứa column này
  const [board, boardError] = await Board.getById(deletedColumn.boardId);
  await Board.update(deletedColumn.boardId, {
    columnIdsList: board.columnIdsList.filter((columnId) => columnId != id),
  });

  if (error) {
    res.status(400).json("Error: " + error);
  } else {
    res.json("Delete successfully");
  }
};
module.exports = columnController;
