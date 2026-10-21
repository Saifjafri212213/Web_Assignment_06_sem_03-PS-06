const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const makeToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const userData = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  const user = await User.create({ name, email, password, role: 'customer' });

  res.status(201).json({ token: makeToken(user), user: userData(user) });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = email && (await User.findOne({ email: email.toLowerCase() }));

  if (!user || !(await bcrypt.compare(password || '', user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({ token: makeToken(user), user: userData(user) });
};

module.exports = { register, login };
