import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/apiService';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({ username, email, password, full_name: fullName });
      console.log('Registration successful:', response);
      setSuccess('Registration successful! You can now log in.');
      // Optionally redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000); 
    } catch (err: any) {
      console.error('Registration failed:', err);
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-pasha-red mb-6">Register</h2>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pasha-green focus:border-pasha-green" />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pasha-green focus:border-pasha-green" />
        </div>
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pasha-green focus:border-pasha-green" />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pasha-green focus:border-pasha-green" />
        </div>
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pasha-green focus:border-pasha-green" />
        </div>
        <button type="submit" disabled={loading} className={`w-full text-white font-bold py-3 px-4 rounded-md transition duration-300 shadow-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-pasha-red hover:bg-opacity-90'}`}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-pasha-green hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;

