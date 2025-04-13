import { FiLink } from 'react-icons/fi';
import AuthForm from '../components/AuthForm';

const Login = ({ onLoginSuccess }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <FiLink className="h-12 w-12 text-primary-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          URL Shortener
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          A simple tool to create and manage shortened URLs
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <AuthForm onLoginSuccess={onLoginSuccess} />
      </div>
    </div>
  );
};

export default Login;