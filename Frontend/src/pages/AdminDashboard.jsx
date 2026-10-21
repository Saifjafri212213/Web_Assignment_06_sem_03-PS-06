import { useEffect, useState } from 'react';
import dashboardApi from '../api/dashboardApi';

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi
      .get()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="page"><p className="error">{error}</p></div>;
  if (!data) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page">
      <h1>Dashboard</h1>

      <div className="grid">
        <div className="card">
          <p className="muted">Today's orders</p>
          <h2>{data.todayOrders}</h2>
        </div>
        <div className="card">
          <p className="muted">Today's revenue (paid)</p>
          <h2>₹{data.todayRevenue}</h2>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>Top 5 items</h3>
          {data.topItems.length === 0 && <p>No data yet.</p>}
          {data.topItems.map((i) => (
            <div className="row between" key={i.name}>
              <span>{i.name}</span>
              <span>{i.quantity} sold</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>Category-wise sales</h3>
          {data.categorySales.length === 0 && <p>No data yet.</p>}
          {data.categorySales.map((c) => (
            <div className="row between" key={c.category}>
              <span>{c.category}</span>
              <span>₹{c.sales}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
