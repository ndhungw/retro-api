const boardController = {};
const Board = require("../model/board.model");

boardController.getAll = async (req, res) => {
  try {
    const boards = await Board.find({});
    res.json(boards);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
};

boardController.getAll = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        res.json(board);
    } catch(err) {
        res.status(400).json("Error: " + err);
    }
}

boardController.add = async (req, res) => {
  const name = req.body.name;
  const userId = req.body.userId;

  try {
    const newBoard = new Board({
      name,
      userId,
    });

    await newBoard.save();
    res.send("Add successfully");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
};

boardController.update = async (req, res) => {
    const name = req.body.name;
    
    try {
        // let board = await Board.findById(req.params.id);
        const board = await Board.findByIdAndUpdate(req.params.id, {
            name: name
        })
        res.send("Update successfully");
    } catch (err) {
        res.status(400).json("Error: " + err);
    }
}


boardController.delete = async (req, res) => {
    try {
        await Board.findByIdAndDelete(req.params.id);
        res.send("Delete successfully");
    } catch (err) {

    }
}

module.exports = boardController;
