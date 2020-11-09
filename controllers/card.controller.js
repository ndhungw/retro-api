const Card = require("../models/card.model");
const cardController = {};
// const Column = require("../models/column.model");

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
  const userId = req.body.userId;
  const columnId = req.body.columnId;

  const addedCard = await Card.add({ content, userId, columnId });

  // // thêm id vào cardIdsList của column chứa nó
  // if (columnId) {
  //   const [column, columnError] = await Column.getById(columnId);

  //   if (column) {
  //     await Column.update(columnId, {
  //       cardIdsList: [...column.cardIdsList, addedCard._id],
  //     });
  //   } else {
  //     res.json("This card does not belong to any column");
  //   }
  // }

  res.json(addedCard);
};

cardController.update = async (req, res) => {
  const id = req.params.id;
  const content = req.body.content;
  const columnId = req.body.columnId;
  const userId = req.body.userId;

  const [updatedCard, error] = await Card.update(id, {
    content,
    columnId,
    userId,
  });

  // const [oldCard, oldCardError] = await Card.getById(id);

  // // nếu thay đổi columnId
  // if (columnId != oldCard.columnId) {
  //   const [oldColumn, oldColumnError] = await Column.getById(oldCard.columnId);
  //   const updatedCardIdsListForOldColumn = oldColumn.cardIdsList.filter(
  //     (cardId) => cardId != oldCard._id
  //   );

  //   // bỏ id của card ra khỏi cardIdsList của column cũ
  //   await Column.update(oldColumn._id, {
  //     cardIdsList: updatedCardIdsListForOldColumn,
  //   });

  //   // thêm id của card vào cardIdsList của column mới
  //   const [newColumn, newColumnError] = await Column.getById(columnId);
  //   await Column.update(columnId, {
  //     cardIdsList: [...newColumn.cardIdsList, id],
  //   });
  // }

  if (error) {
    res.status(400).json("Error: " + error);
  } else {
    res.json(updatedCard);
  }
};

cardController.delete = async (req, res) => {
  const id = req.params.id;

  const [deletedCard, error] = await Card.delete(id);
  // console.log("deletedCard: ", deletedCard);

  if (error) {
    res.status(400).json("Error: " + error);
  } else {
    // // xóa id này bên trong cardIdsList của column chứa card này
    // const [column, getColumnError] = await Column.getById(deletedCard.columnId);
    // const newCardIdsList = column.cardIdsList.filter((cardId) => cardId != id);
    // await Column.update(column._id, { cardIdsList: newCardIdsList });
    // // thông báo
    res.json("Delete successfully");
  }
};

module.exports = cardController;
