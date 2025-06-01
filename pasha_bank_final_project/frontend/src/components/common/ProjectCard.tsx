import React from 'react';
import { Link } from 'react-router-dom';

// Define the Project type (can be moved to a types file later)
interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  current_amount: number;
  goal_amount: number;
  // Add other fields as needed: status, owner, category, end_date etc.
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const fundingPercentage = (project.current_amount / project.goal_amount) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <img src={project.image_url} alt={project.title} className="w-full h-48 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-pasha-red mb-2">{project.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{project.description}</p>
        
        {/* Funding Progress */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-pasha-green h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${fundingPercentage > 100 ? 100 : fundingPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span className="font-medium text-pasha-green">${project.current_amount.toLocaleString()}</span>
            <span className="text-gray-500">raised of ${project.goal_amount.toLocaleString()} goal</span>
          </div>
        </div>

        {/* Action Button */}
        <Link 
          to={`/project/${project.id}`} 
          className="mt-auto block bg-pasha-green text-white text-sm font-medium px-4 py-2 rounded hover:bg-opacity-90 transition duration-300 w-full text-center"
        >
          View Details & Invest
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;

