
import React from 'react';
import { Link } from 'react-router-dom';
import { useInvestment } from '../contexts/InvestmentContext';
import { Investment, ProjectCategory } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import { Icons, CATEGORY_COLORS } from '../constants';
import Button from '../components/common/Button';

const DashboardPage: React.FC = () => {
  const { user, investments, projects, loading, error } = useInvestment();

  if (loading && !user) { // Show loading spinner only if user data is also loading
    return <div className="flex justify-center items-center min-h-[60vh]"><LoadingSpinner text="Loading dashboard..." /></div>;
  }

  if (error) {
    return <div className="max-w-3xl mx-auto py-12 px-4"><AlertMessage type="error" message={error} /></div>;
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <AlertMessage type="info" message="Please log in to view your dashboard." />
         <Link to="/"><Button variant="primary" className="mt-4">Discover Projects</Button></Link>
      </div>
    );
  }

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  
  const getProjectCategory = (projectId: string): ProjectCategory | undefined => {
    const project = projects.find(p => p.id === projectId);
    return project?.category;
  };

  const impactSummary = investments.reduce((acc, inv) => {
    const category = getProjectCategory(inv.projectId);
    if (category) {
      acc[category] = (acc[category] || 0) + inv.amount;
    }
    return acc;
  }, {} as Record<ProjectCategory, number>);


  return (
    <div className="min-h-screen bg-pasha-gray-light py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <div className="flex items-center space-x-4 mb-6">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="h-20 w-20 rounded-full object-cover shadow-md" />
            ) : (
              <Icons.UserCircle className="h-20 w-20 text-pasha-blue" />
            )}
            <div>
              <h1 className="text-3xl font-bold text-pasha-blue">Welcome back, {user.name}!</h1>
              <p className="text-pasha-gray-dark">Here's an overview of your community investments.</p>
            </div>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-pasha-blue-dark mb-1">Total Invested</h2>
            <p className="text-3xl font-bold text-pasha-green">AZN {totalInvested.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-pasha-blue-dark mb-1">Number of Investments</h2>
            <p className="text-3xl font-bold text-pasha-blue">{investments.length}</p>
          </div>
        </div>

        {/* My Investments Table */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-10">
          <h2 className="text-xl font-semibold text-pasha-blue-dark mb-6">My Investments</h2>
          {investments.length === 0 ? (
            <div className="text-center py-8">
              <Icons.InformationCircle className="h-10 w-10 mx-auto text-pasha-gray mb-3" />
              <p className="text-pasha-gray-dark mb-4">You haven't made any investments yet.</p>
              <Link to="/">
                <Button variant="primary">Discover Projects to Invest In</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-pasha-gray">
                    <th className="py-3 px-4 text-sm font-semibold text-pasha-gray-dark">Project Name</th>
                    <th className="py-3 px-4 text-sm font-semibold text-pasha-gray-dark">Amount (AZN)</th>
                    <th className="py-3 px-4 text-sm font-semibold text-pasha-gray-dark">Date</th>
                    <th className="py-3 px-4 text-sm font-semibold text-pasha-gray-dark">Category</th>
                    <th className="py-3 px-4 text-sm font-semibold text-pasha-gray-dark"></th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((inv: Investment) => {
                    const category = getProjectCategory(inv.projectId);
                    const categoryColorClass = category ? CATEGORY_COLORS[category] : "bg-gray-100 text-gray-800";
                    return (
                    <tr key={inv.id} className="border-b border-pasha-gray-light hover:bg-pasha-gray-light/50">
                      <td className="py-4 px-4 text-pasha-blue-dark font-medium">{inv.projectName}</td>
                      <td className="py-4 px-4 text-pasha-gray-dark">{inv.amount.toLocaleString()}</td>
                      <td className="py-4 px-4 text-pasha-gray-dark">{new Date(inv.date).toLocaleDateString()}</td>
                       <td className="py-4 px-4">
                        {category && (
                           <span className={`px-2 py-1 text-xs font-semibold rounded-full ${categoryColorClass}`}>
                            {category}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link to={`/project/${inv.projectId}`}>
                          <Button variant="outline" size="sm">View Project</Button>
                        </Link>
                      </td>
                    </tr>
                  );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Impact Summary Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-pasha-blue-dark mb-6">Your Investment Impact</h2>
          {Object.keys(impactSummary).length === 0 && investments.length > 0 && (
             <p className="text-pasha-gray-dark">Loading impact data...</p>
          )}
          {Object.keys(impactSummary).length === 0 && investments.length === 0 && (
             <p className="text-pasha-gray-dark">Invest in projects to see your impact here.</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(impactSummary).map(([category, amount]) => (
              <div key={category} className={`p-4 rounded-md ${CATEGORY_COLORS[category as ProjectCategory] || 'bg-gray-100 text-gray-800'}`}>
                <p className="font-semibold text-sm">{category}</p>
                <p className="text-lg font-bold">AZN {amount.toLocaleString()}</p>
                <p className="text-xs opacity-80">Invested</p>
              </div>
            ))}
          </div>
           <p className="text-xs text-pasha-gray-dark mt-6">
            This is a simplified overview of your contributions by category. Each project aims to create specific positive outcomes.
          </p>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
