import { useEffect, useState } from 'react';
import tableApi from '../api/tableApi';

function AdminTables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ tableNumber: '', capacity: '' });
  const [editingId, setEditingId] = useState(null);

  const load = () =>
    tableApi
      .getAll()
      .then(setTables)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const data = { tableNumber: Number(form.tableNumber), capacity: Number(form.capacity) };
    try {
      if (editingId) await tableApi.update(editingId, data);
      else await tableApi.create(data);
      setForm({ tableNumber: '', capacity: '' });
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const edit = (table) => {
    setEditingId(table._id);
    setForm({ tableNumber: table.tableNumber, capacity: table.capacity });
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this table?')) return;
    try {
      await tableApi.remove(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page narrow">
      <h1>Tables</h1>

      <form className="card form" onSubmit={submit}>
        {error && <p className="error">{error}</p>}
        <label>Table number</label>
        <input name="tableNumber" type="number" min="1" value={form.tableNumber} onChange={change} />
        <label>Capacity</label>
        <input name="capacity" type="number" min="1" value={form.capacity} onChange={change} />
        <button type="submit">{editingId ? 'Update table' : 'Add table'}</button>
      </form>

      {loading && <p>Loading...</p>}
      {!loading && tables.length === 0 && <p>No tables yet.</p>}

      {tables.map((t) => (
        <div className="card row between" key={t._id}>
          <span>Table {t.tableNumber} (seats {t.capacity})</span>
          <span className="row">
            <button onClick={() => edit(t)}>Edit</button>
            <button className="danger" onClick={() => remove(t._id)}>Delete</button>
          </span>
        </div>
      ))}
    </div>
  );
}

export default AdminTables;
