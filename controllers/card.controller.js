const Card = require("../models/card.model");
const cardController = {};

cardController.get = async (req, res) => {
  const id = req.params.id;

  const [card, error] = await Card.get(id);

  if (error) {
    res.status(400).json("Error: " + error);
  } else {
    res.json(card);
  }
};

cardController.getAll = async (req, res) => {
  const [cards, error] = await Card.getAll();

  if (error) {
    res.status(400).json("Error: " + error);
  } else {
    res.json(cards);
  }
};

cardController.add = async (req, res) => {
  const content = req.body.content;
  const authorId = req.body.authorId;
  const columnId = req.body.columnId;

  const isAdded = await Card.add({
    content,
    authorId,
    columnId,
  });

  if (isAdded) {
    res.json("Add successfully");
  } else {
    res.json("Add failed");
  }
};

cardController.update = async (req, res) => {
  const id = req.params.id;
  const content = req.body.content;
  const columnId = req.body.columnId;

  const error = await Card.update(id, { content, columnId });

  if (error) {
    res.status(400).json("Error: " + error);
  } else {
    res.json("Update successfully");
  }
};

cardController.delete = async (req, res) => {
  const id = req.params.id;

  const error = await Card.delete(id);

  if (error) {
    res.status(400).json("Error: " + error);
  } else {
    res.json("Delete successfully");
  }
};

module.exports = cardController;
