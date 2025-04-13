import { useState } from 'react';
import { FiCopy, FiTrash2, FiExternalLink, FiBarChart } from 'react-icons/fi';
import { format } from 'date-fns';
import { deleteLink } from '../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

const LinkTable = ({ links, onLinkDeleted, onViewAnalytics, isLoading }) => {
  const [deletingId, setDeletingId] = useState(null);
  
  const baseUrl = window.location.origin;
  
  const copyToClipboard = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
  };
  
  const handleDelete = async (id) => {
    setDeletingId(id);
    
    try {
      await deleteLink(id);
      toast.success('Link deleted successfully');
      
      if (onLinkDeleted) {
        onLinkDeleted(id);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete link');
    } finally {
      setDeletingId(null);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };
  
  if (isLoading) {
    return (
      <div className="card">
        <div className="py-10 flex justify-center">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }
  
  if (!links || links.length === 0) {
    return (
      <div className="card">
        <div className="py-10 text-center text-gray-500">
          <p className="text-lg">No links created yet</p>
          <p className="text-sm mt-2">Create your first shortened URL using the form above</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original URL</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short Link</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {links.map((link) => {
            const shortUrl = `${baseUrl}/${link.shortCode}`;
            
            return (
              <tr key={link._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900 truncate max-w-xs">
                      {link.originalUrl}
                    </span>
                    <a
                      href={link.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <FiExternalLink />
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm text-primary-600">
                      {link.shortCode}
                    </span>
                    <button
                      onClick={() => copyToClipboard(shortUrl)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <FiCopy />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {link.clicks || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(link.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(link.expiresAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewAnalytics(link._id)}
                      className="text-blue-600 hover:text-blue-900"
                      title="View Analytics"
                    >
                      <FiBarChart />
                    </button>
                    <button
                      onClick={() => handleDelete(link._id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={deletingId === link._id}
                      title="Delete Link"
                    >
                      {deletingId === link._id ? (
                        <LoadingSpinner size="small" />
                      ) : (
                        <FiTrash2 />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LinkTable;