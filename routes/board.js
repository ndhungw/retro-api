const express = require('express');
const router = express.Router();
const boardController = require('../controller/board.controller');

// CREATE
router.post('/add', boardController.add);

// READ
router.get('/', boardController.getAll);

// UPDATE
router.post('/update/:id', boardController.update);

// DELETE
router.delete('/:id', boardController.delete);

module.exports = router;