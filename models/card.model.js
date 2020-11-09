const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const Column = require("../models/column.model");

const cardSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    columnId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Card = mongoose.model("Card", cardSchema, "cards");

Card.getById = async (id) => {
  let [card, error] = [null, null];

  try {
    card = await Card.findById(id);
  } catch (err) {
    error = err;
  }

  return [card, error];
};

Card.get = async (query) => {
  let [cards, error] = [[], null];

  try {
    cards = await Card.find(query);
  } catch (err) {
    error = err;
  }

  return [cards, error];
};

Card.add = async ({ content, userId, columnId }) => {
  const cardToAdd = {};

  if (content) {
    cardToAdd.content = content;
  }
  if (userId) {
    cardToAdd.userId = userId;
  }
  if (columnId) {
    cardToAdd.columnId = columnId;
  }

  const card = new Card(cardToAdd);

  const newCard = await card.save();

  // // add the id of this card into cardIdsList of column with id = columnId
  // if (columnId) {
  //   try {
  //     const column = await Column.findById(columnId);
  //     if (column) {
  //       await Column.findOneAndUpdate(
  //         { _id: columnId },
  //         {
  //           cardIdsList: [...column.cardIdsList, newCard._id],
  //         }
  //       );
  //     } else {
  //       throw "Column not found";
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  return newCard;
};

Card.update = async (id, { content, userId, columnId }) => {
  let [updatedCard, error] = [null, null];
  const cardToUpdate = {};

  if (content) {
    cardToUpdate.content = content;
  }
  if (userId) {
    cardToUpdate.userId = userId;
  }
  if (columnId) {
    cardToUpdate.columnId = columnId;
  }

  try {
    // const oldCard = await Card.findById(id);

    // // nếu có cập nhật columnId
    // if (columnId != oldCard.columnId) {
    //   // console.log("yo, column có sự cập nhật nha");
    //   const oldColumn = await Column.findById(oldCard.columnId);
    //   // console.log("oldColumn:", oldColumn);
    //   const newCardIdsList = oldColumn.cardIdsList.filter(
    //     (cardId) => cardId != oldCard._id
    //   );
    //   // console.log("oldColumn.cardIdsList: ", test01);

    //   // loại bỏ id của card cũ ra khỏi cardIdsList của column cũ
    //   const responseOfRemove = await Column.findOneAndUpdate(
    //     { _id: oldColumn._id },
    //     {
    //       cardIdsList: newCardIdsList,
    //     }
    //   );
    //   // console.log("responseOfRemove: ", responseOfRemove);

    //   const newColumn = await Column.findById(columnId);

    //   // thêm id của card mới vào cardIdsList của column mới
    //   await Column.findOneAndUpdate(
    //     { _id: columnId },
    //     {
    //       cardIdsList: [...newColumn.cardIdsList, id],
    //     }
    //   );
    // }

    const card = await Card.findOneAndUpdate({ _id: id }, cardToUpdate, {
      new: true, // lay lai gia tri cu
    });
    updatedCard = card;
  } catch (err) {
    error = err;
  }

  return [updatedCard, error];
};

Card.delete = async (id) => {
  let [deletedCard, error] = [null, null];

  try {
    const card = await Card.findByIdAndDelete(id);
    // console.log("card that is deleted: " + card);
    deletedCard = card;
    if (!card) {
      throw "This card does not exist";
    }

    // // xóa id này bên trong cardIdsList của column chứa card này
    // const column = await Column.findById(deletedCard.columnId);
    // const newCardList = column.cardIdsList.filter((cardId) => cardId != id);
    // await Column.findOneAndUpdate(
    //   { _id: column._id },
    //   {
    //     cardIdsList: newCardList,
    //   }
    // );
  } catch (err) {
    error = err;
  }

  return [deletedCard, error];
};

module.exports = Card;
