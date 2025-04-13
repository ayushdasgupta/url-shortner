import { useState } from 'react';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { loginUser } from '../utils/api';
import { saveToken } from '../utils/auth';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

const AuthForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await loginUser(formData);
      
      if (data.token) {
        saveToken(data.token);
        toast.success('Login successful');
        onLoginSuccess();
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError(error.message || 'An error occurred during login');
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input pl-10"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input pl-10"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full btn btn-primary flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <LoadingSpinner size="small" />
          ) : (
            <>
              <FiLogIn className="mr-2" /> Login
            </>
          )}
        </button>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Default account: intern@dacoid.com</p>
          <p>Password: Test123</p>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;