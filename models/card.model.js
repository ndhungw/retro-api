const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  authorId: {
    type: String,
    required: true,
  },
  columnId: {
    type: String,
    required: true,
  },
});

const Card = mongoose.model("Card", cardSchema, "cards");

Card.get = async (id) => {
  let [card, error] = [null, null];

  try {
    card = await Card.findById(id);
  } catch (err) {
    error = err;
  }

  return [card, error];
};

Card.getAll = async () => {
  let [cards, error] = [[], null];

  try {
    cards = await Card.find({});
  } catch (err) {
    error = err;
  }

  return [cards, error];
};

Card.add = async ({ content, authorId, columnId }) => {
    const card = new Card({
        content,
        authorId,
        columnId
    });

    const newCard = await card.save();
    console.log("Card.add = " + (newCard === card))
    return newCard === card;
}

Card.update = async(id, { content, authorId, columnId }) => {
    let error = null;

    try {
        await Card.findByIdAndUpdate(id, {
            content,
            authorId,
            columnId
        });
    } catch (err) {
        error = err;
    }

    return error;
}

Card.delete = async (id) => {
    let error = null;
    
    try {
        const deletedCard = await Card.findByIdAndDelete(id);
        console.log('card that is deleted: ' + deletedCard);
        if (!deletedCard) {
          throw 'This card does not exist'
        }
    } catch (err) {
        error = err;
    }

    return error;
}

module.exports = Card;
