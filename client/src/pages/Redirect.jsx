import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiLink } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';

const Redirect = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const redirectToOriginalUrl = async () => {
      try {
        const {data}= await axios.get("https://api.ipify.org?format=json")
        const {ip}=data
        console.log(ip);
        
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/${shortCode}?ip=${ip}`);
        
        if (response.data.url) {
          window.location.href = response.data.url;
        } else {
          setError('Invalid redirect URL');
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Link not found or expired');
      }
    };
    
    if (shortCode) {
      redirectToOriginalUrl();
    }
  }, [shortCode]);
  
  const handleBackToHome = () => {
    navigate('/');
  };
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-center mb-6">
            <FiLink className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">
            Error
          </h2>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700 text-center">{error}</p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleBackToHome}
              className="btn btn-primary"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <LoadingSpinner size="large" />
        <h2 className="mt-4 text-xl text-gray-600">
          Redirecting you...
        </h2>
      </div>
    </div>
  );
};

export default Redirect;