import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import orderApi from '../api/orderApi';

const NEXT = { Placed: 'Preparing', Preparing: 'Served', Served: 'Paid' };

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orderApi
      .getAll()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const changeStatus = async (id, status) => {
    setError('');
    try {
      const updated = await orderApi.updateStatus(id, status);
      setOrders(orders.map((o) => (o._id === id ? updated : o)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <h1>All Orders</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((order) => (
        <div className="card row between" key={order._id}>
          <div>
            <Link to={`/orders/${order._id}`}>
              Table {order.table?.tableNumber} · {order.user?.name}
            </Link>
            <p className="muted">
              {order.items.map((i) => `${i.name} × ${i.quantity}`).join(', ')}
            </p>
            <p>₹{order.total}</p>
          </div>
          <div>
            <span className={`status ${order.status}`}>{order.status}</span>
            <div className="row">
              {NEXT[order.status] && (
                <button onClick={() => changeStatus(order._id, NEXT[order.status])}>
                  Mark {NEXT[order.status]}
                </button>
              )}
              {(order.status === 'Placed' || order.status === 'Preparing') && (
                <button className="danger" onClick={() => changeStatus(order._id, 'Cancelled')}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminOrders;
