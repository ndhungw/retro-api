const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// CREATE
router.post("/add", userController.add);

/* GET users listing. */
router.get("/", userController.get);
router.get("/:id", userController.getById);

// UPDATE
router.post("/update/:id", userController.update);

// DELETE
router.delete("/:id", userController.delete);

module.exports = router;
