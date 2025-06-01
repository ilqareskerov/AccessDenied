import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/common/ProjectCard';
import { getProjects } from '../services/apiService'; // Import API service
// import LoadingSpinner from '../components/common/LoadingSpinner'; // TODO: Create LoadingSpinner
// import AlertMessage from '../components/common/AlertMessage'; // TODO: Create AlertMessage

// Define Project type (move to types file later)
interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  current_amount: number;
  goal_amount: number;
  // Add other fields matching the backend serialization
}

const HomePage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch projects with 'funding' status by default
        const data = await getProjects('funding'); 
        // Convert amounts back to numbers if they are strings from API
        const formattedData = data.map((p: any) => ({
          ...p,
          current_amount: parseFloat(p.current_amount),
          goal_amount: parseFloat(p.goal_amount),
        }));
        setProjects(formattedData);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError('Failed to load investment opportunities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-pasha-red to-red-700 text-white py-16 md:py-24 px-4 mb-12 rounded-lg shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Invest in Your Community.
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-pasha-green mb-6 bg-white bg-opacity-90 px-4 py-2 rounded inline-block shadow">
            <span className="text-pasha-red">Grow</span> Together.
          </h2>
          <p className="text-lg md:text-xl opacity-95 max-w-2xl mx-auto">
            Discover and support local businesses and community initiatives through the Pasha Community Investment Platform.
          </p>
        </div>
      </header>

      {/* Projects Grid Section */}
      <main className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Investment Opportunities</h2>

        {loading && <p className="text-center text-gray-600 py-10">Loading projects...</p> /* TODO: Replace with LoadingSpinner */}
        {error && <p className="text-center text-red-600 py-10">{error}</p> /* TODO: Replace with AlertMessage */}

        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl mb-2">No projects available right now.</p>
            <p>Please check back later for new investment opportunities.</p>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;

