import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import orderApi from '../api/orderApi';

function OrderDetail({ user }) {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    orderApi
      .getOne(id)
      .then(setOrder)
      .catch((err) => setError(err.message));
  }, [id]);

  const cancel = async () => {
    try {
      setOrder(await orderApi.cancel(id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!order) {
    return <div className="page">{error ? <p className="error">{error}</p> : <p>Loading...</p>}</div>;
  }

  return (
    <div className="page narrow">
      <Link to={user.role === 'admin' ? '/admin/orders' : '/my-orders'}>← Back</Link>
      <h1>Order Bill</h1>
      {error && <p className="error">{error}</p>}

      <div className="card">
        <p>
          Table {order.table?.tableNumber} · <span className={`status ${order.status}`}>{order.status}</span>
        </p>
        <p className="muted">
          {order.user?.name} · {new Date(order.createdAt).toLocaleString()}
        </p>
        <hr />
        {order.items.map((item) => (
          <div className="row between" key={item.menuItem}>
            <span>{item.name} × {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <hr />
        <div className="row between"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
        <div className="row between"><span>GST (5%)</span><span>₹{order.gst}</span></div>
        <div className="row between"><strong>Total</strong><strong>₹{order.total}</strong></div>
      </div>

      {user.role === 'customer' && order.status === 'Placed' && (
        <button className="danger" onClick={cancel}>Cancel order</button>
      )}
    </div>
  );
}

export default OrderDetail;
