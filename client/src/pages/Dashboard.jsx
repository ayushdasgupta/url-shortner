import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CreateLink from '../components/CreateLink';
import LinkTable from '../components/LinkTable';
import Analytics from '../components/Analytics';
import { getUserLinks } from '../utils/api';
import toast from 'react-hot-toast';

const Dashboard = ({ onLogout }) => {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLinkId, setSelectedLinkId] = useState(null);
  
  const fetchLinks = async () => {
    setIsLoading(true);
    try {
      const data = await getUserLinks();
      setLinks(data);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch links');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLinks();
  }, []);
  
  const handleLinkCreated = (newLink) => {
    setLinks(prevLinks => [newLink, ...prevLinks]);
  };
  
  const handleLinkDeleted = (deletedId) => {
    setLinks(prevLinks => prevLinks.filter(link => link._id !== deletedId));
  };
  
  const handleViewAnalytics = (linkId) => {
    setSelectedLinkId(linkId);
  };
  
  const handleCloseAnalytics = () => {
    setSelectedLinkId(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onLogout={onLogout} />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <CreateLink onLinkCreated={handleLinkCreated} />
          
          <h2 className="text-xl font-semibold mb-4">Your Links</h2>
          <LinkTable 
            links={links}
            onLinkDeleted={handleLinkDeleted}
            onViewAnalytics={handleViewAnalytics}
            isLoading={isLoading}
          />
        </div>
      </main>
      
      {selectedLinkId && (
        <Analytics 
          linkId={selectedLinkId}
          onClose={handleCloseAnalytics}
        />
      )}
    </div>
  );
};

export default Dashboard;