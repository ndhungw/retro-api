const Column = require("../models/column.model");
const columnController = {};

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

  // const status = await Column.add({
  //   name,
  //   boardId
  // });

  // if (status) {
  //   res.json("Add successfully");
  // } else {
  //   res.json("Add failed");
  // }

  const newColumn = await Column.add({
    name,
    boardId,
  });

  res.json(newColumn);
};

columnController.update = async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;

  const [updatedColumn, error] = await Column.update(id, {
    name,
  });

  if (error) {
    res.status(400).json("Error: " + error);
  } else {
    res.json(updatedColumn);
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
