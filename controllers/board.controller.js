const boardController = {};
const Board = require("../models/board.model");

// phiên bản cũ
// boardController.getAll = async (req, res) => {
//   try {
//     const boards = await Board.find({}).limit(6);
//     // console.log(boards);
//     res.json(boards);
//   } catch (err) {
//     res.status(400).json("Error: " + err);
//   }
// };

boardController.get = async (req, res) => {
  const query = req.query;
  const [boards, err] = await Board.get(query);

  if (err) {
    res.status(400).json("Error: " + err);
  } else {
    res.json(boards);
  }
};

//-- các hàm chưa refactor sang bên model xử lý, vẫn còn xử lý trực tiếp tại controller

boardController.getById = async (req, res) => {
  const id = req.params.id;
  const [board, err] = await Board.getById(id);

  if (err) {
    res.status(400).json("Error: " + err);
  } else {
    res.json(board);
  }
};

boardController.add = async (req, res) => {
  const name = req.body.name;
  const userId = req.body.userId;
  const status = await Board.add({
    name,
    userId,
  });

  if (status) {
    res.send("Add successfully");
  } else {
    res.json("Add failed");
    // res.status(400).json("Error: " + err);
  }
};

boardController.update = async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;

  const error = await Board.update(id, {
    name: name,
  });

  if (error) {
    res.status(400).json("Error: " + err);
  } else {
    res.send("Update successfully");
  }
};

boardController.delete = async (req, res) => {
  const id = req.params.id;

  const error = await Board.delete(id);
  if (error) {
    res.status(400).json("Error: " + err);
  } else {
    res.send("Delete successfully");
  }
};

module.exports = boardController;
