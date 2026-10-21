import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import MenuDetail from './pages/MenuDetail';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import OrderDetail from './pages/OrderDetail';
import AdminMenuForm from './pages/AdminMenuForm';
import AdminTables from './pages/AdminTables';
import AdminOrders from './pages/AdminOrders';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const login = ({ token, user }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCart([]);
  };

  const addToCart = (item) => {
    const existing = cart.find((i) => i._id === item._id);
    if (existing) {
      setCart(cart.map((i) => (i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i)));
    } else {
      setCart([...cart, { _id: item._id, name: item.name, price: item.price, quantity: 1 }]);
    }
  };

  const changeQuantity = (id, change) => {
    setCart(
      cart
        .map((i) => (i._id === id ? { ...i, quantity: i.quantity + change } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <Navbar user={user} cartCount={cartCount} onLogout={logout} />

      <Routes>
        <Route path="/" element={<Navigate to="/menu" />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/register" element={<Register onLogin={login} />} />
        <Route path="/menu" element={<Menu user={user} addToCart={addToCart} />} />
        <Route path="/menu/:id" element={<MenuDetail user={user} addToCart={addToCart} />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute user={user} role="customer">
              <Cart cart={cart} changeQuantity={changeQuantity} clearCart={() => setCart([])} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute user={user} role="customer">
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute user={user}>
              <OrderDetail user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/menu/new"
          element={
            <ProtectedRoute user={user} role="admin">
              <AdminMenuForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/menu/:id/edit"
          element={
            <ProtectedRoute user={user} role="admin">
              <AdminMenuForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tables"
          element={
            <ProtectedRoute user={user} role="admin">
              <AdminTables />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute user={user} role="admin">
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute user={user} role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
