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

Column.get = async (query) => {
  let [columns, error] = [[], null];

  try {
    columns = await Column.find(query);
  } catch (err) {
    console.log("Error: " + err);
    error = err;
  }
  return [columns, error];
};

Column.getById = async (id) => {
  let [column, error] = [null, null];

  try {
    column = await Column.findById(id);
  } catch (err) {
    error = err;
  }

  return [column, error];
};

Column.add = async ({ name, boardId }) => {
  const column = new Column({
    name,
    boardId,
  });

  const newColumn = await column.save();
  console.log("Column.add: " + (newColumn === column));
  return newColumn;
};

Column.update = async (id, { name }) => {
  let [updatedColumn, error] = [null, null];

  try {
    const oldColumn = await Column.findByIdAndUpdate(id, {
      name,
    });
    updatedColumn = oldColumn;
    updatedColumn.name = name;
  } catch (err) {
    console.log("Error: " + err);
    error = err;
  }
  return [updatedColumn, error];
};

// DELETE
Column.delete = async (id) => {
  let error = null;

  try {
    await Column.findByIdAndDelete(id);
  } catch (err) {
    error = err;
  }

  return error;
};

module.exports = Column;
