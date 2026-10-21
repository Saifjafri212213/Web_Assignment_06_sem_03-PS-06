import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import authApi from '../api/authApi';

function Register({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await authApi.register(form);
      onLogin(data);
      navigate('/menu');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page narrow">
      <h1>Register</h1>
      <form className="card form" onSubmit={submit}>
        {error && <p className="error">{error}</p>}
        <label>Name</label>
        <input name="name" value={form.name} onChange={change} />
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={change} />
        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={change} />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;
