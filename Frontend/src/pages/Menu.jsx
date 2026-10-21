import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import menuApi from '../api/menuApi';

function Menu({ user, addToCart }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [params, setParams] = useSearchParams();

  const search = params.get('q') || '';
  const category = params.get('category') || '';
  const vegOnly = params.get('veg') === '1';

  useEffect(() => {
    menuApi
      .getAll()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  const toggleAvailable = async (item) => {
    try {
      const updated = await menuApi.update(item._id, { available: !item.available });
      setItems(items.map((i) => (i._id === updated._id ? updated : i)));
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await menuApi.remove(id);
      setItems(items.filter((i) => i._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const categories = [...new Set(items.map((i) => i.category))];

  const shown = items.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) &&
      (!category || i.category === category) &&
      (!vegOnly || i.isVeg)
  );

  return (
    <div className="page">
      <h1>Menu</h1>

      {user?.role === 'admin' && (
        <p>
          <Link className="btn" to="/admin/menu/new">
            + Add item
          </Link>
        </p>
      )}

      <div className="filters">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setParam('q', e.target.value)}
        />
        <select value={category} onChange={(e) => setParam('category', e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <label className="check">
          <input
            type="checkbox"
            checked={vegOnly}
            onChange={(e) => setParam('veg', e.target.checked ? '1' : '')}
          />
          Veg only
        </label>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && shown.length === 0 && <p>No items found.</p>}

      <div className="grid">
        {shown.map((item) => (
          <div className="card" key={item._id}>
            {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
            <h3>
              <Link to={`/menu/${item._id}`}>{item.name}</Link>
            </h3>
            <p className="muted">
              {item.category} · {item.isVeg ? '🟢 Veg' : '🔴 Non-veg'}
            </p>
            <p>₹{item.price}</p>
            {!item.available && <p className="error">Unavailable</p>}

            {user?.role === 'customer' && (
              <button disabled={!item.available} onClick={() => addToCart(item)}>
                Add to cart
              </button>
            )}

            {user?.role === 'admin' && (
              <div className="row">
                <Link className="btn" to={`/admin/menu/${item._id}/edit`}>
                  Edit
                </Link>
                <button onClick={() => toggleAvailable(item)}>
                  {item.available ? 'Mark unavailable' : 'Mark available'}
                </button>
                <button className="danger" onClick={() => remove(item._id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
