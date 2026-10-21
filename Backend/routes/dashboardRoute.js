const express = require('express');
const { getDashboard } = require('../controllers/dashboardController');
const authHandler = require('../middleware/authHandler');
const allowRoles = require('../middleware/allowRoles');

const router = express.Router();

router.get('/', authHandler, allowRoles('admin'), getDashboard);

module.exports = router;
