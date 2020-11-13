const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Column = require("../models/column.model");

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
    console.log("card", cards);

    if (query.columnId) {
      const column = await mongoose.model("Column").findById(query.columnId);
      console.log("column", column);
      const cardIdsList = column.cardIdsList;
      console.log("cardIdsList", cardIdsList);

      // const sortedCardsList = cardIdsList.map((cardId) => {
      //   const selectedCards = cards.filter((card) => card._id == cardId);
      //   return selectedCards[0];
      // });
      const sortedCardsList = cardIdsList.map(
        (cardId) =>
          cards.filter((card) => card._id.toString() == cardId.toString())[0]
      );

      return [sortedCardsList, error];
    }
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

  // add the id of this card into cardIdsList of column with id = columnId
  if (columnId) {
    try {
      const [column, columnError] = await mongoose
        .model("Column")
        .getById(columnId);
      if (column) {
        // await mongoose.model("Column").update(columnId, {
        //   cardIdsList: [...column.cardIdsList, newCard._id],
        // });
        await mongoose.model("Column").findByIdAndUpdate(columnId, {
          cardIdsList: [...column.cardIdsList, newCard._id],
        });
      } else {
        throw "This card does not belong to any column";
      }
    } catch (err) {
      console.log(err);
    }
  }

  return newCard;
};

Card.update = async (id, { content, userId, columnId }) => {
  let [updatedCard, error] = [null, null];
  const cardToUpdate = {};

  if (userId) {
    cardToUpdate.userId = userId;
  }
  if (content) {
    cardToUpdate.content = content;
  }
  if (columnId) {
    cardToUpdate.columnId = columnId;
  }

  try {
    const oldCard = await Card.findById(id);

    // if (columnId === null && userId === null && content === null) {
    //   // được gọi từ Column.update, mục đích muốn thay đổi cardIdsList
    //   // card này sẽ tạm thời có columnId = null
    //   await Card.findByIdAndUpdate(id, { columnId: null });
    // } else

    if (columnId) {
      // nếu có cập nhật columnId
      if (columnId != oldCard.columnId) {
        // const [oldColumn, oldColumnError] = await mongoose
        //   .model("Column")
        //   .getById(oldCard.columnId);
        const oldColumn = await mongoose
          .model("Column")
          .findById(oldCard.columnId);
        const newColumn = await mongoose.model("Column").findById(columnId);

        // cập nhật cardIdsList của column cũ
        const updatedCardIdsListForOldColumn = oldColumn.cardIdsList.filter(
          (cardId) => cardId != id
        );
        console.log(
          "Card.update - updatedCardIdsListForOldColumn:",
          updatedCardIdsListForOldColumn
        );
        // bỏ id của card cũ ra khỏi cardIdsList của column cũ
        // await mongoose.model("Column").update(oldColumn._id, {
        //   cardIdsList: updatedCardIdsListForOldColumn,
        // });
        const oldColumnUpdated = await mongoose
          .model("Column")
          .findByIdAndUpdate(
            oldColumn._id,
            {
              cardIdsList: updatedCardIdsListForOldColumn,
            },
            { new: true }
          );
        console.log("Card.update - oldColumnUpdated", oldColumnUpdated);

        // thêm id của card mới vào cardIdsList của column mới
        // await mongoose.model("Column").update(columnId, {
        //   cardIdsList: [...newColumn.cardIdsList, id],
        // });
        const newColumnUpdated = await mongoose
          .model("Column")
          .findByIdAndUpdate(
            columnId,
            {
              cardIdsList: [...newColumn.cardIdsList, id],
            },
            { new: true }
          );
        console.log("Card.update - newColumnUpdated", newColumnUpdated);
      }
    }
    updatedCard = await Card.findOneAndUpdate({ _id: id }, cardToUpdate, {
      new: true, // lay lai gia tri cu
    });
  } catch (err) {
    error = err;
  }

  return [updatedCard, error];
};

Card.delete = async (id) => {
  let [deletedCard, error] = [null, null];

  try {
    // xóa card
    deletedCard = await Card.findByIdAndDelete(id);
    if (!deletedCard) {
      throw "This card does not exist";
    }

    // xóa id này bên trong cardIdsList của column chứa card này
    // const [column, getColumnError] = await mongoose
    //   .model("Column")
    //   .getById(deletedCard.columnId);
    const column = await mongoose
      .model("Column")
      .findById(deletedCard.columnId);

    // bo id ra khoi cardIdsList trong column
    if (column) {
      const newCardList = column.cardIdsList.filter((cardId) => cardId != id);
      const updatedColumnWhenDeleteCard = await mongoose
        .model("Column")
        .findByIdAndUpdate(
          column._id,
          {
            cardIdsList: newCardList,
          },
          { new: true }
        );
      console.log(
        "Card.delte - updatedColumnWhenDeleteCard",
        updatedColumnWhenDeleteCard
      );
    }
  } catch (err) {
    error = err;
  }

  return [deletedCard, error];
};

module.exports = Card;
