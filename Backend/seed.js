require('dotenv').config();
require('dns').setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');

const User = require('./models/user');
const MenuItem = require('./models/menuItem');
const Table = require('./models/table');
const Order = require('./models/order');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Order.deleteMany({});
  await MenuItem.deleteMany({});
  await Table.deleteMany({});
  await User.deleteMany({});

  const [, alice, bob] = await User.create([
    { name: 'Admin', email: 'admin@restaurant.com', password: 'admin123', role: 'admin' },
    { name: 'Alice', email: 'alice@example.com', password: 'customer123', role: 'customer' },
    { name: 'Bob', email: 'bob@example.com', password: 'customer123', role: 'customer' },
  ]);

  const menu = await MenuItem.create([
    { name: 'Paneer Tikka', category: 'Starters', price: 220, isVeg: true },
    { name: 'Chicken 65', category: 'Starters', price: 260, isVeg: false },
    { name: 'Veg Spring Rolls', category: 'Starters', price: 150, isVeg: true },
    { name: 'Dal Makhani', category: 'Main Course', price: 240, isVeg: true },
    { name: 'Butter Chicken', category: 'Main Course', price: 320, isVeg: false },
    { name: 'Veg Biryani', category: 'Main Course', price: 230, isVeg: true },
    { name: 'Chicken Biryani', category: 'Main Course', price: 290, isVeg: false },
    { name: 'Butter Naan', category: 'Breads', price: 50, isVeg: true },
    { name: 'Gulab Jamun', category: 'Desserts', price: 90, isVeg: true },
    { name: 'Ice Cream Sundae', category: 'Desserts', price: 130, isVeg: true, available: false },
    { name: 'Masala Chai', category: 'Beverages', price: 40, isVeg: true },
    { name: 'Fresh Lime Soda', category: 'Beverages', price: 70, isVeg: true },
  ]);

  const tables = await Table.create([
    { tableNumber: 1, capacity: 2 },
    { tableNumber: 2, capacity: 4 },
    { tableNumber: 3, capacity: 4 },
    { tableNumber: 4, capacity: 6 },
  ]);

  const byName = (name) => menu.find((m) => m.name === name);

  const makeOrder = (user, table, status, list) => {
    const items = list.map(([name, quantity]) => {
      const m = byName(name);
      return { menuItem: m._id, name: m.name, category: m.category, price: m.price, quantity };
    });
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const gst = Math.round(subtotal * 0.05 * 100) / 100;
    return { user: user._id, table: table._id, items, subtotal, gst, total: subtotal + gst, status };
  };

  await Order.create([
    makeOrder(alice, tables[0], 'Paid', [['Paneer Tikka', 1], ['Butter Naan', 2], ['Masala Chai', 2]]),
    makeOrder(alice, tables[1], 'Paid', [['Butter Chicken', 1], ['Butter Naan', 3], ['Gulab Jamun', 2]]),
    makeOrder(bob, tables[2], 'Paid', [['Veg Biryani', 2], ['Fresh Lime Soda', 2]]),
    makeOrder(bob, tables[3], 'Served', [['Chicken Biryani', 2], ['Chicken 65', 1]]),
    makeOrder(alice, tables[1], 'Preparing', [['Dal Makhani', 1], ['Butter Naan', 2]]),
    makeOrder(bob, tables[0], 'Placed', [['Veg Spring Rolls', 2], ['Masala Chai', 2]]),
    makeOrder(alice, tables[2], 'Placed', [['Gulab Jamun', 1], ['Masala Chai', 1]]),
    makeOrder(bob, tables[3], 'Cancelled', [['Chicken 65', 2]]),
  ]);

  console.log('Seeded: 3 users, 12 menu items, 4 tables, 8 orders');
  await mongoose.disconnect();
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
