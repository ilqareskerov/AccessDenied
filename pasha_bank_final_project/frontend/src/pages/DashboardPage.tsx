import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { getMyInvestments } from '../services/apiService'; // Import API service

// Define Investment type (move to types file later)
interface Investment {
  id: string;
  projectId: string; // Corrected: Assuming backend sends projectId
  project_title: string;
  amount: number; // Keep as number
  status: string;
  invested_at: string;
}

const DashboardPage: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [projectsOwned, setProjectsOwned] = useState<any[]>([]); // For project owner later

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Check if user is logged in (simple check for token)
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError('Please log in to view your dashboard.');
          setLoading(false);
          return;
        }

        const data = await getMyInvestments();
        // Convert amounts from string (API) to number
        const formattedData = data.map((inv: any) => ({
          ...inv,
          amount: parseFloat(inv.amount),
        }));
        setInvestments(formattedData);

        // TODO: Fetch owned projects if user is a project owner

      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        if (err.response?.status === 401 || err.response?.status === 422) { // Handle unauthorized/invalid token
             setError('Your session may have expired. Please log in again.');
             localStorage.removeItem('accessToken'); // Clear invalid token
        } else {
            setError('Failed to load dashboard data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600 py-10">Loading dashboard...</p>; // TODO: Replace with LoadingSpinner
  }

  if (error) {
    return <p className="text-center text-red-600 py-10">{error}</p>; // TODO: Replace with AlertMessage
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-10">
      <h1 className="text-3xl md:text-4xl font-bold text-pasha-red mb-8">My Dashboard</h1>

      {/* Investment Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2 border-pasha-green">My Investments</h2>
        {investments.length === 0 ? (
          <p className="text-gray-500">You haven't made any investments yet. <Link to="/" className="text-pasha-green hover:underline">Explore projects</Link>.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {investments.map((investment) => (
                  <tr key={investment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-pasha-red hover:underline">
                      {/* Corrected: Use projectId */} 
                      <Link to={`/project/${investment.projectId}`}>{investment.project_title}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${investment.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${investment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {investment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(investment.invested_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Owned Projects Section (Placeholder) */}
      {/* {projectsOwned.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2 border-pasha-green">My Projects</h2>
          <p className="text-gray-500">Project owner section placeholder.</p>
        </section>
      )} */}

      {/* Profile Settings Section (Placeholder) */}
      {/* <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2 border-pasha-green">Profile Settings</h2>
        <p className="text-gray-500">Profile editing placeholder.</p>
      </section> */}
    </div>
  );
};

export default DashboardPage;

