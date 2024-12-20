import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/users/register', { email, password });
      navigate('/login');
    } catch (err: any) {
      setError('Registration failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-6">Create your account</h2>
        <form onSubmit={handleRegister} className="space-y-6">
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
            className="w-full py-2 px-4 border rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            Sign up
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/login" className="text-blue-600 hover:text-blue-500">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;