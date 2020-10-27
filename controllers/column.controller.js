const Column = require("../models/column.model");
const columnController = {};

columnController.getAll = async (req, res) => {
  const [columns, error] = await Column.getAll();

  if (error) {
    res.status(400).json("Error: " + error);
  } else {
    res.json(columns);
  }
};

columnController.get = async (req, res) => {
  const [column, error] = await Column.get(req.params.id);

  if (error) {
    res.status(400).json("Error: " + error);
  } else {
    res.json(column);
  }
};

columnController.add = async (req, res) => {
  const name = req.body.name;
  const boardId = req.body.boardId;

  const status = await Column.add({
    name,
    boardId
  });

  if (status) {
    res.json("Add successfully");
  } else {
    res.json("Add failed");
  }
};

columnController.update = async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;

  const error = await Column.update(id, {
    name,
  });

  if (error) {
    res.status(400).json("Error: " + error);
  } else {
    res.json("Update successfully");
  }
};

columnController.delete = async (req, res) => {
  const id = req.params.id;

  const error = await Column.delete(id);

  if (error) {
    res.status(400).json("Error: " + error);
  } else {
    res.json("Delete successfully");
  }
};
module.exports = columnController;
