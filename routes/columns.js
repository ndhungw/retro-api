const express = require('express');
const router = express.Router();
const columnController = require('../controllers/column.controller');

// CREATE
router.post('/add', columnController.add);

// READ
router.get('/', columnController.getAll);
router.get('/:id', columnController.get);

// // UPDATE
router.post('/update/:id', columnController.update);

// // DELETE
router.delete('/:id', columnController.delete);

module.exports = router;