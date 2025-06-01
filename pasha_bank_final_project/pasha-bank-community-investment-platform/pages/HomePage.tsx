
import React from 'react';
import ProjectCard from '../components/ProjectCard';
import { useInvestment } from '../contexts/InvestmentContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import { APP_NAME, Icons } from '../constants';

const HomePage: React.FC = () => {
  const { projects, loading, error } = useInvestment();

  return (
    <div className="min-h-screen bg-pasha-gray-light">
      <header className="bg-gradient-to-r from-pasha-blue to-pasha-blue-dark text-white py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Icons.Logo className="h-16 w-auto mx-auto mb-4 invert brightness-0 "/>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Invest in Your Community. <span className="text-pasha-gold">Grow Together.</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Discover and support local businesses and community initiatives through {APP_NAME}.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {loading && <LoadingSpinner text="Loading projects..." />}
        {error && <AlertMessage type="error" message={error} />}
        
        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-12">
            <Icons.InformationCircle className="h-12 w-12 mx-auto text-pasha-gray mb-4" />
            <p className="text-xl text-pasha-gray-dark">No projects available at the moment.</p>
            <p className="text-sm text-pasha-gray-dark">Please check back later for new investment opportunities.</p>
          </div>
        )}

        {!loading && projects.length > 0 && (
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
