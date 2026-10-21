import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import orderApi from '../api/orderApi';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orderApi
      .getMine()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page narrow">
      <h1>My Orders</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((order) => (
        <div className="card row between" key={order._id}>
          <div>
            <Link to={`/orders/${order._id}`}>Table {order.table?.tableNumber}</Link>
            <p className="muted">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <span className={`status ${order.status}`}>{order.status}</span>
            <p>₹{order.total}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyOrders;
