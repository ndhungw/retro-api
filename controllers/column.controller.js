const Column = require("../models/column.model");
const columnController = {};

columnController.get = async (req, res) => {
  const query = req.query;
  const [columns, error] = await Column.get(query);

  if (error) {
    res.status(400).json("Error: ", error);
  } else {
    res.json(columns);
  }
};

columnController.getById = async (req, res) => {
  const [column, error] = await Column.getById(req.params.id);

  if (error) {
    res.status(400).json("Error: ", error);
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

  if (error) {
    res.status(400).json("Error: ", error);
  } else {
    res.json(updatedColumn);
  }
};

columnController.delete = async (req, res) => {
  const id = req.params.id;

  // console.log("columnController.delete - call Column.delete(id)");
  const [deletedColumn, error] = await Column.delete(id);

  // // xóa tất cả các card thuộc column này
  // deletedColumn.cardIdsList.map(async (cardId) => {
  //   await Card.delete(cardId);
  // });

  // // xóa id khỏi columnIdsList trong board chứa column này
  // const [board, boardError] = await Board.getById(deletedColumn.boardId);
  // await Board.update(deletedColumn.boardId, {
  //   columnIdsList: board.columnIdsList.filter((columnId) => columnId != id),
  // });

  if (error) {
    res.status(400).json("Error: ", error);
  } else {
    res.json(deletedColumn);
  }
};
module.exports = columnController;
