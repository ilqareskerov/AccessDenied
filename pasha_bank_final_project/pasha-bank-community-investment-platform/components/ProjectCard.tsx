
import React from 'react';
import { Link } from 'react-router-dom';
import { Project, ProjectCategory } from '../types';
import { CATEGORY_COLORS, Icons } from '../constants';
import Button from './common/Button';

interface ProjectCardProps {
  project: Project;
}

const ProgressBar: React.FC<{ current: number; goal: number }> = ({ current, goal }) => {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  return (
    <div>
      <div className="flex justify-between mb-1 text-xs text-pasha-gray-dark">
        <span>AZN {current.toLocaleString()}</span>
        <span>{percentage.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-pasha-gray rounded-full h-2.5">
        <div
          className="bg-pasha-green h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
       <div className="text-right mt-1 text-xs text-pasha-gray-dark">
        Goal: AZN {goal.toLocaleString()}
      </div>
    </div>
  );
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const categoryColorClass = CATEGORY_COLORS[project.category] || "bg-gray-100 text-gray-800";

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-2xl flex flex-col">
      <img className="w-full h-48 object-cover" src={project.imageUrl} alt={project.name} />
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-pasha-blue-dark group-hover:text-pasha-gold transition-colors">
            {project.name}
          </h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${categoryColorClass}`}>
            {project.category}
          </span>
        </div>
        <p className="text-sm text-pasha-gray-dark mb-1 h-10 overflow-hidden">{project.tagline}</p>
        <p className="text-xs text-gray-500 mb-3">by {project.owner} in {project.location}</p>
        
        <div className="mt-auto">
          <ProgressBar current={project.currentAmount} goal={project.goalAmount} />
          <div className="flex justify-between items-center text-sm text-pasha-gray-dark mt-3 mb-4">
            <span>{project.investorCount} Investors</span>
            {/* Calculate days left - simplified */}
            <span>{Math.max(0, Math.round((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days left</span>
          </div>
          <Link to={`/project/${project.id}`} className="block w-full">
            <Button variant="outline" size="md" className="w-full" rightIcon={<Icons.ArrowRight className="w-4 h-4"/>}>
              View Details & Invest
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
