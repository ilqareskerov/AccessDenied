import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Removed unused Link import
import { getProjectDetails, makeInvestment } from '../services/apiService'; // Import API service

// Define Project type (move to types file later)
interface ProjectUpdate {
  id: string;
  update_text: string;
  created_at: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  goal_amount: number; // Keep as number
  current_amount: number; // Keep as number
  status: string;
  start_date: string | null;
  end_date: string | null;
  owner_id: number;
  owner_username: string;
  created_at: string;
  updated_at: string;
  updates: ProjectUpdate[];
}

const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentError, setInvestmentError] = useState<string | null>(null);
  const [investmentSuccess, setInvestmentSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!projectId) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getProjectDetails(projectId);
        // Convert amounts from string (API) to number
        const formattedData = {
          ...data,
          goal_amount: parseFloat(data.goal_amount),
          current_amount: parseFloat(data.current_amount),
        };
        setProject(formattedData);
      } catch (err) {
        console.error(`Failed to fetch project ${projectId}:`, err);
        setError('Failed to load project details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [projectId]);

  const handleInvestmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvestmentError(null);
    setInvestmentSuccess(null);
    if (!projectId || !investmentAmount) return;

    try {
      const amount = parseFloat(investmentAmount);
      if (isNaN(amount) || amount <= 0) {
        setInvestmentError('Please enter a valid positive amount.');
        return;
      }
      
      // Call API to make investment
      await makeInvestment(projectId, amount); // Removed unused 'result' variable assignment
      setInvestmentSuccess(`Successfully invested $${amount}!`);
      setInvestmentAmount(''); // Clear input
      // Refresh project data to show updated amount
      const updatedData = await getProjectDetails(projectId);
      setProject({
        ...updatedData,
        goal_amount: parseFloat(updatedData.goal_amount),
        current_amount: parseFloat(updatedData.current_amount),
      });

    } catch (err: any) {
      console.error('Investment failed:', err);
      const message = err.response?.data?.message || 'Investment failed. Please try again.';
      setInvestmentError(message);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600 py-10">Loading project details...</p>; // TODO: Replace with LoadingSpinner
  }

  if (error) {
    return <p className="text-center text-red-600 py-10">{error}</p>; // TODO: Replace with AlertMessage
  }

  if (!project) {
    return <p className="text-center text-gray-500 py-10">Project not found.</p>;
  }

  const fundingPercentage = (project.current_amount / project.goal_amount) * 100;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 md:p-10">
      <h1 className="text-3xl md:text-4xl font-bold text-pasha-red mb-4">{project.title}</h1>
      <div className="md:flex md:space-x-8">
        {/* Left Column: Image & Funding */}
        <div className="md:w-2/3 mb-6 md:mb-0">
          <img src={project.image_url || 'https://via.placeholder.com/800x400/cccccc/000000?text=No+Image'} alt={project.title} className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md mb-6" />
          
          {/* Funding Progress Bar */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Funding Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
              <div
                className="bg-gradient-to-r from-pasha-green to-green-500 h-4 rounded-full transition-all duration-500 ease-out text-xs font-medium text-blue-100 text-center p-0.5 leading-none"
                style={{ width: `${fundingPercentage > 100 ? 100 : fundingPercentage}%` }}
              >
                 {fundingPercentage.toFixed(0)}%
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span className="font-medium text-pasha-green">${project.current_amount.toLocaleString()} raised</span>
              <span className="text-gray-500">of ${project.goal_amount.toLocaleString()} goal</span>
            </div>
          </div>

          {/* Project Description */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">About the Project</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{project.description}</p>
          </div>

          {/* Project Updates */}
          {project.updates && project.updates.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Updates</h3>
              <div className="space-y-4">
                {project.updates.map(update => (
                  <div key={update.id} className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-800 text-sm">{update.update_text}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(update.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Investment & Details */}
        <div className="md:w-1/3">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-8">
            <h2 className="text-2xl font-semibold text-pasha-green mb-4">Invest Now</h2>
            {/* Investment Form */}
            <form onSubmit={handleInvestmentSubmit}>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Investment Amount ($)</label>
                <input 
                  type="number" 
                  id="amount" 
                  name="amount" 
                  min="1" 
                  step="any" // Allow decimals if needed
                  placeholder="Enter amount" 
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pasha-green focus:border-pasha-green"
                  required // Make amount required
                  disabled={project.status !== 'funding'} // Disable if not funding
                />
              </div>
              {investmentError && <p className="text-red-600 text-sm mb-3">{investmentError}</p>}
              {investmentSuccess && <p className="text-green-600 text-sm mb-3">{investmentSuccess}</p>}
              <button 
                type="submit" 
                className={`w-full text-white font-bold py-3 px-4 rounded-md transition duration-300 shadow-md ${project.status === 'funding' ? 'bg-pasha-red hover:bg-opacity-90' : 'bg-gray-400 cursor-not-allowed'}`}
                disabled={project.status !== 'funding'}
              >
                {project.status === 'funding' ? 'Confirm Investment' : 'Funding Closed'}
              </button>
            </form>
            
            <hr className="my-6 border-gray-300" />

            {/* Project Details */}
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Project Details</h3>
            <ul className="text-sm space-y-2 text-gray-600">
              <li><strong>Category:</strong> {project.category || 'N/A'}</li>
              <li><strong>Owner:</strong> {project.owner_username || 'N/A'}</li>
              <li><strong>Funding Deadline:</strong> {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A'}</li>
              <li><strong>Status:</strong> <span className={`font-medium ${project.status === 'funding' ? 'text-pasha-green' : 'text-gray-600'}`}>{project.status}</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;

