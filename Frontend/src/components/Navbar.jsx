import { NavLink, useNavigate } from 'react-router';

function Navbar({ user, cartCount, onLogout }) {
  const navigate = useNavigate();

  const logout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav>
      <strong>Restaurant</strong>
      <NavLink to="/menu">Menu</NavLink>

      {user?.role === 'customer' && (
        <>
          <NavLink to="/cart">Cart ({cartCount})</NavLink>
          <NavLink to="/my-orders">My Orders</NavLink>
        </>
      )}

      {user?.role === 'admin' && (
        <>
          <NavLink to="/admin/orders">Orders</NavLink>
          <NavLink to="/admin/tables">Tables</NavLink>
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
        </>
      )}

      <span className="spacer" />

      {user ? (
        <>
          <span>{user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
        </>
      )}
    </nav>
  );
}

export default Navbar;
