import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import menuApi from '../api/menuApi';
import MenuForm from '../components/MenuForm';

function AdminMenuForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      menuApi
        .getOne(id)
        .then(setItem)
        .catch((err) => setError(err.message));
    }
  }, [id]);

  const save = async (data) => {
    if (id) await menuApi.update(id, data);
    else await menuApi.create(data);
    navigate('/menu');
  };

  if (error) return <div className="page"><p className="error">{error}</p></div>;
  if (id && !item) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page narrow">
      <h1>{id ? 'Edit Menu Item' : 'Add Menu Item'}</h1>
      <MenuForm initial={item} onSubmit={save} buttonText={id ? 'Update' : 'Add'} />
    </div>
  );
}

export default AdminMenuForm;
