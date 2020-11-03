const Card = require("../models/card.model");
const cardController = {};

cardController.getById = async (req, res) => {
  const id = req.params.id;

  const [card, error] = await Card.getById(id);

  if (error) {
    res.status(400).json("Error: " + error);
  } else {
    res.json(card);
  }
};

cardController.get = async (req, res) => {
  const query = req.query;
  const [cards, error] = await Card.get(query);

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

  // const isAdded = await Card.add({
  //   content,
  //   authorId,
  //   columnId,
  // });

  // if (isAdded) {
  //   res.json("Add successfully");
  // } else {
  //   res.json("Add failed");
  // }

  const addedCard = await Card.add({
    content,
    authorId,
    columnId,
  });

  res.json(addedCard);
};

cardController.update = async (req, res) => {
  const id = req.params.id;
  const content = req.body.content;
  const columnId = req.body.columnId;
  const authorId = req.body.authorId;

  const error = await Card.update(id, { content, columnId, authorId });

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
