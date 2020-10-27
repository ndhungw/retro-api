const express = require('express');
const router = express.Router();
const cardController = require('../controllers/card.controller');

router.get('/', cardController.getAll);
router.get('/:id', cardController.get);

router.post('/add', cardController.add);

router.post('/:id', cardController.update);

router.delete('/:id', cardController.delete);

router.post('/update/:id', cardController.update);

module.exports = router;