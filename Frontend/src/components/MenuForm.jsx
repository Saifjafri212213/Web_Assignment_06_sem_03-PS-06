import { useState } from 'react';

function MenuForm({ initial, onSubmit, buttonText }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    category: initial?.category || '',
    price: initial?.price ?? '',
    isVeg: initial?.isVeg ?? true,
    available: initial?.available ?? true,
    imageUrl: initial?.imageUrl || '',
  });
  const [error, setError] = useState('');

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit({ ...form, price: Number(form.price) });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      {error && <p className="error">{error}</p>}

      <label>Name</label>
      <input name="name" value={form.name} onChange={change} />

      <label>Category</label>
      <input name="category" value={form.category} onChange={change} />

      <label>Price (₹)</label>
      <input name="price" type="number" min="0" value={form.price} onChange={change} />

      <label>Image URL</label>
      <input name="imageUrl" value={form.imageUrl} onChange={change} />

      <label className="check">
        <input type="checkbox" name="isVeg" checked={form.isVeg} onChange={change} />
        Vegetarian
      </label>

      <label className="check">
        <input type="checkbox" name="available" checked={form.available} onChange={change} />
        Available
      </label>

      <button type="submit">{buttonText}</button>
    </form>
  );
}

export default MenuForm;
