const boardController = {};
const Board = require("../models/board.model");

boardController.get = async (req, res) => {
  const query = req.query;
  const [boards, err] = await Board.get(query);

  if (err) {
    res.status(400).json("Error: " + err);
  } else {
    res.json(boards);
  }
};

boardController.getById = async (req, res) => {
  const id = req.params.id;
  const [board, err] = await Board.getById(id);

  if (err) {
    res.status(400).json("Error: " + err);
  } else {
    res.json(board);
  }
};

boardController.add = async (req, res) => {
  const name = req.body.name;
  const userId = req.body.userId;

  const newBoard = await Board.add({
    name,
    userId,
  });

  res.json(newBoard);
};

boardController.update = async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const columnIdsList = req.body.columnIdsList;

  const [updatedBoard, error] = await Board.update(id, { name, columnIdsList });

  if (error) {
    res.status(400).json("Error: " + error);
  } else {
    res.send(updatedBoard);
  }
};

boardController.delete = async (req, res) => {
  const id = req.params.id;

  const [deletedBoard, error] = await Board.delete(id);
  if (error) {
    res.status(400).json("Error: " + err);
  } else {
    res.send("Delete successfully");
  }
};

module.exports = boardController;
