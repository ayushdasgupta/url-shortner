import { useState } from 'react';
import { FiLink, FiPlus, FiCalendar } from 'react-icons/fi';
import { createLink } from '../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

const CreateLink = ({ onLinkCreated }) => {
  const [formData, setFormData] = useState({
    originalUrl: '',
    customAlias: '',
    expiresAt: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const payload = {
        originalUrl: formData.originalUrl,
        ...(formData.customAlias && { customAlias: formData.customAlias }),
        ...(formData.expiresAt && { expiresAt: formData.expiresAt })
      };
      
      const newLink = await createLink(payload);
      
      toast.success('Link created successfully');
      
      setFormData({
        originalUrl: '',
        customAlias: '',
        expiresAt: ''
      });
      
      if (onLinkCreated) {
        onLinkCreated(newLink);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card mb-6">
      <h2 className="text-xl font-semibold mb-4">Create Short Link</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700 mb-1">
            URL to Shorten
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLink className="text-gray-400" />
            </div>
            <input
              id="originalUrl"
              name="originalUrl"
              type="url"
              required
              className="input pl-10"
              placeholder="https://example.com/very-long-url"
              value={formData.originalUrl}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <button
            type="button"
            className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <FiPlus className="mr-1" />
            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
          </button>
        </div>
        
        {showAdvanced && (
          <>
            <div className="mb-4">
              <label htmlFor="customAlias" className="block text-sm font-medium text-gray-700 mb-1">
                Custom Alias (Optional)
              </label>
              <input
                id="customAlias"
                name="customAlias"
                type="text"
                className="input"
                placeholder="my-custom-link"
                value={formData.customAlias}
                onChange={handleChange}
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Leave empty for an auto-generated code
              </p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
                <input
                  id="expiresAt"
                  name="expiresAt"
                  type="datetime-local"
                  className="input pl-10"
                  value={formData.expiresAt}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                When this link should expire
              </p>
            </div>
          </>
        )}
        
        <button
          type="submit"
          className="w-full btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner size="small" /> : 'Create Short Link'}
        </button>
      </form>
    </div>
  );
};

export default CreateLink;