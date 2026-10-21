import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import menuApi from '../api/menuApi';

function MenuDetail({ user, addToCart }) {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    menuApi
      .getOne(id)
      .then(setItem)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <div className="page"><p className="error">{error}</p></div>;
  if (!item) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page narrow">
      <Link to="/menu">← Back to menu</Link>
      <div className="card">
        {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
        <h1>{item.name}</h1>
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
      </div>
    </div>
  );
}

export default MenuDetail;
