const express = require('express');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrder,
  updateStatus,
  cancelOrder,
} = require('../controllers/orderController');
const authHandler = require('../middleware/authHandler');
const allowRoles = require('../middleware/allowRoles');

const router = express.Router();

router.use(authHandler);

router.post('/', allowRoles('customer'), createOrder);
router.get('/', allowRoles('admin'), getAllOrders);
router.get('/mine', getMyOrders);
router.get('/:id', getOrder);
router.patch('/:id/status', allowRoles('admin'), updateStatus);
router.patch('/:id/cancel', allowRoles('customer'), cancelOrder);

module.exports = router;
