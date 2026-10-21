import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import tableApi from '../api/tableApi';
import orderApi from '../api/orderApi';

function Cart({ cart, changeQuantity, clearCart }) {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [table, setTable] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    tableApi
      .getAll()
      .then(setTables)
      .catch((err) => setError(err.message));
  }, []);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const placeOrder = async () => {
    setError('');
    if (!table) {
      setError('Please select a table');
      return;
    }
    try {
      const order = await orderApi.create({
        table,
        items: cart.map((i) => ({ menuItem: i._id, quantity: i.quantity })),
      });
      clearCart();
      navigate(`/orders/${order._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="page">
        <h1>Cart</h1>
        <p>Your cart is empty. <Link to="/menu">Browse the menu</Link></p>
      </div>
    );
  }

  return (
    <div className="page narrow">
      <h1>Cart</h1>

      <div className="card">
        {cart.map((item) => (
          <div className="row between" key={item._id}>
            <span>{item.name} (₹{item.price})</span>
            <span className="row">
              <button onClick={() => changeQuantity(item._id, -1)}>-</button>
              {item.quantity}
              <button onClick={() => changeQuantity(item._id, 1)}>+</button>
            </span>
          </div>
        ))}
        <hr />
        <p>Subtotal: ₹{subtotal}</p>
        <p className="muted">GST and the final total are calculated when the order is placed.</p>
      </div>

      <div className="card form">
        {error && <p className="error">{error}</p>}
        <label>Table</label>
        <select value={table} onChange={(e) => setTable(e.target.value)}>
          <option value="">Select a table</option>
          {tables.map((t) => (
            <option key={t._id} value={t._id}>
              Table {t.tableNumber} (seats {t.capacity})
            </option>
          ))}
        </select>
        <button onClick={placeOrder}>Place order</button>
      </div>
    </div>
  );
}

export default Cart;
