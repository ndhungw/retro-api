const express = require("express");
const router = express.Router();
const boardController = require("../controllers/board.controller");

// CREATE
router.post("/add", boardController.add);

// READ
router.get("/", boardController.get);
router.get("/:id", boardController.getById);

// UPDATE
router.post("/update/:id", boardController.update);

// DELETE
router.delete("/:id", boardController.delete);

module.exports = router;
