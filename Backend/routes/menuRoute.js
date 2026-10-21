const express = require('express');
const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/menuController');
const authHandler = require('../middleware/authHandler');
const allowRoles = require('../middleware/allowRoles');

const router = express.Router();

router.get('/', getItems);
router.get('/:id', getItem);
router.post('/', authHandler, allowRoles('admin'), createItem);
router.put('/:id', authHandler, allowRoles('admin'), updateItem);
router.delete('/:id', authHandler, allowRoles('admin'), deleteItem);

module.exports = router;
