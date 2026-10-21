import { Link } from 'react-router';

function NotFound() {
  return (
    <div className="page">
      <h1>404 - Page not found</h1>
      <Link to="/menu">Go to menu</Link>
    </div>
  );
}

export default NotFound;
