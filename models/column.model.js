const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const columnSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      default: "New col",
    },
    boardId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Column = mongoose.model("Column", columnSchema, "columns");

Column.getAll = async () => {
  let [columns, error] = [[], null];

  try {
    columns = await Column.find({});
  } catch (err) {
    console.log("Error: " + err);
    error = err;
  }
  return [columns, error];
};

Column.get = async (id) => {
    let [column, error] = [null, null];

    try {
        column = await Column.findById(id);
    } catch(err) {
        error = err;
    }

    return [column, error];
}

Column.add = async ({ name, boardId }) => {
    const column = new Column({
        name,
        boardId
    });

    const newColumn = await column.save();
    // console.log('Column.add: ' + (newColumn === column));
    return newColumn === column;
}

Column.update = async (id, { name }) => {
    let error = null;

    try {
        const column = await Column.findByIdAndUpdate(id, {
            name
        });
    } catch (err) {
        console.log("Error: " + err);
        error = err;
    }
    return error;
}

// DELETE
Column.delete = async (id) => {
    let error = null;

    try {
        await Column.findByIdAndDelete(id);
    } catch (err) {
        error = err;
    }

    return error;
}

module.exports = Column;
