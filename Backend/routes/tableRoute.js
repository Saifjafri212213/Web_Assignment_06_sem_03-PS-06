const express = require('express');
const {
  getTables,
  createTable,
  updateTable,
  deleteTable,
} = require('../controllers/tableController');
const authHandler = require('../middleware/authHandler');
const allowRoles = require('../middleware/allowRoles');

const router = express.Router();

router.get('/', authHandler, getTables);
router.post('/', authHandler, allowRoles('admin'), createTable);
router.put('/:id', authHandler, allowRoles('admin'), updateTable);
router.delete('/:id', authHandler, allowRoles('admin'), deleteTable);

module.exports = router;
