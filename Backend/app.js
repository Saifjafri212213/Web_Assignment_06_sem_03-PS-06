require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/menu', require('./routes/menuRoute'));
app.use('/api/tables', require('./routes/tableRoute'));
app.use('/api/orders', require('./routes/orderRoute'));
app.use('/api/dashboard', require('./routes/dashboardRoute'));

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
