const express = require("express");
const router = express.Router();
const cardController = require("../controllers/card.controller");

router.get("/", cardController.get);
router.get("/:id", cardController.getById);

router.post("/add", cardController.add);

router.post("/:id", cardController.update);

router.delete("/:id", cardController.delete);

router.post("/update/:id", cardController.update);

module.exports = router;
