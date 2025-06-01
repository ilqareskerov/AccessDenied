import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/apiService';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginUser({ username, password });
      // Assuming the token is stored in localStorage by apiService
      console.log('Login successful:', response);
      // TODO: Update global auth state if using context/redux
      navigate('/dashboard'); // Redirect to dashboard on successful login
    } catch (err: any) {
      console.error('Login failed:', err);
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-pasha-red mb-6">Login</h2>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pasha-green focus:border-pasha-green"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pasha-green focus:border-pasha-green"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white font-bold py-3 px-4 rounded-md transition duration-300 shadow-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-pasha-red hover:bg-opacity-90'}`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-pasha-green hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;

