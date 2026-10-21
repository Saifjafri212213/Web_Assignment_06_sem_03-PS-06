import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import authApi from '../api/authApi';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await authApi.login({ email, password });
      onLogin(data);
      navigate(data.user.role === 'admin' ? '/admin/orders' : '/menu');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page narrow">
      <h1>Login</h1>
      <form className="card form" onSubmit={submit}>
        {error && <p className="error">{error}</p>}
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <p>
        New here? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
