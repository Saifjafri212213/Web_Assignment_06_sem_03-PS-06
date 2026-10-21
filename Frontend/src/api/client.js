const API_URL = import.meta.env.VITE_API_URL;

async function request(path, method = 'GET', body) {
  const token = localStorage.getItem('token');

  const response = await fetch(API_URL + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, 'POST', body),
  put: (path, body) => request(path, 'PUT', body),
  patch: (path, body) => request(path, 'PATCH', body),
  delete: (path) => request(path, 'DELETE'),
};

export default api;
