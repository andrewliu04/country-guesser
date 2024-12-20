import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/game');
    } catch (err: any) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 flex items-center">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-6">Sign in to your account</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input id="email" type="email" required
              className="w-full px-3 py-2 border"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input id="password" type="password" required
              className="w-full px-3 py-2 border"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 border rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">
            Sign in
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/register" className="text-blue-600 hover:text-blue-500">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;