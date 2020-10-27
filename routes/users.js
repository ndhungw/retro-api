const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// CREATE
router.post('/add', userController.add);

/* GET users listing. */
router.get('/', userController.getAll);
router.get('/:id', userController.get);

// UPDATE
router.post('/update/:id', userController.update);

// DELETE
router.delete('/:id', userController.delete);

module.exports = router;
