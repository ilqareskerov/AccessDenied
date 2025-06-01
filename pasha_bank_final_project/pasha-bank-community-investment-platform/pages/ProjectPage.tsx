
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Fixed typo here
import { useInvestment } from '../contexts/InvestmentContext';
import { Project } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import Button from '../components/common/Button';
import InvestmentModal from '../components/InvestmentModal';
import { generateEnhancedProjectDescription, generateImpactAssessmentSummary } from '../services/geminiService';
import { CATEGORY_COLORS, Icons } from '../constants';

const ProgressBar: React.FC<{ current: number; goal: number; size?: 'sm' | 'md' }> = ({ current, goal, size = 'md' }) => {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const heightClass = size === 'sm' ? 'h-2' : 'h-3.5';
  return (
    <div>
      <div className={`w-full bg-pasha-gray rounded-full ${heightClass}`}>
        <div
          className={`bg-pasha-green ${heightClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-1.5 text-xs text-pasha-gray-dark">
        <span>AZN {current.toLocaleString()} raised ({percentage.toFixed(0)}%)</span>
        <span>Goal: AZN {goal.toLocaleString()}</span>
      </div>
    </div>
  );
};


const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { getProjectById, refreshProject: refreshProjectContextData } = useInvestment();
  
  const [project, setProject] = useState<Project | null | undefined>(undefined); // undefined for initial, null for not found
  const [isLoadingProject, setIsLoadingProject] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [investmentSuccessMessage, setInvestmentSuccessMessage] = useState<string | null>(null);

  const [geminiDescription, setGeminiDescription] = useState<string | null>(null);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [geminiDescriptionError, setGeminiDescriptionError] = useState<string | null>(null);

  const [geminiImpact, setGeminiImpact] = useState<string | null>(null);
  const [isGeneratingImpact, setIsGeneratingImpact] = useState(false);
  const [geminiImpactError, setGeminiImpactError] = useState<string | null>(null);

  const fetchProjectData = useCallback(async () => {
    if (!projectId) return;
    setIsLoadingProject(true);
    // Try context first
    let foundProject = getProjectById(projectId);
    if (!foundProject) {
      // If not in context (e.g. direct navigation), fetch it (mock or real API)
      // For this example, we assume getProjectById from context is sufficient
      // Or, you might need a direct fetch service here.
      // For now, if not in context, it might mean it's an invalid ID for the mock setup.
      // Let's use refreshProjectContextData to potentially update the context if needed
      await refreshProjectContextData(projectId); //This will update projects in context
      foundProject = getProjectById(projectId); // Try again after refresh
    }
    setProject(foundProject);
    setIsLoadingProject(false);
  }, [projectId, getProjectById, refreshProjectContextData]);


  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);


  const handleGenerateDescription = async () => {
    if (!project) return;
    setIsGeneratingDescription(true);
    setGeminiDescription(null);
    setGeminiDescriptionError(null);
    try {
      const desc = await generateEnhancedProjectDescription(project);
      setGeminiDescription(desc);
    } catch (err) {
      setGeminiDescriptionError("Failed to generate AI description.");
      console.error(err);
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleGenerateImpact = async () => {
    if (!project) return;
    setIsGeneratingImpact(true);
    setGeminiImpact(null);
    setGeminiImpactError(null);
    try {
      const impact = await generateImpactAssessmentSummary(project);
      setGeminiImpact(impact);
    } catch (err) {
      setGeminiImpactError("Failed to generate AI impact summary.");
      console.error(err);
    } finally {
      setIsGeneratingImpact(false);
    }
  };

  if (isLoadingProject) {
    return <div className="flex justify-center items-center min-h-[60vh]"><LoadingSpinner text="Loading project details..." /></div>;
  }

  if (project === null || project === undefined) { // Check for both null and undefined after loading
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <AlertMessage type="error" message="Project not found." />
        <Button onClick={() => navigate('/')} variant="primary" className="mt-6">Go to Homepage</Button>
      </div>
    );
  }

  const categoryColorClass = CATEGORY_COLORS[project.category] || "bg-gray-100 text-gray-800";
  const daysLeft = Math.max(0, Math.round((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));


  return (
    <div className="bg-pasha-gray-light min-h-screen py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <img src={project.imageUrl} alt={project.name} className="w-full h-64 md:h-96 object-cover" />
        
        <div className="p-6 md:p-8">
          {investmentSuccessMessage && (
            <AlertMessage type="success" message={investmentSuccessMessage} onClose={() => setInvestmentSuccessMessage(null)} />
          )}

          <div className="flex flex-col md:flex-row justify-between items-start mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-pasha-blue mb-2 md:mb-0">{project.name}</h1>
            <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${categoryColorClass} self-start md:self-center`}>
              {project.category}
            </span>
          </div>
          <p className="text-lg text-pasha-gray-dark mb-1">{project.tagline}</p>
          <p className="text-sm text-gray-500 mb-4">By {project.owner} in {project.location}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center md:text-left">
            <div>
              <div className="text-2xl font-bold text-pasha-green">AZN {project.currentAmount.toLocaleString()}</div>
              <div className="text-sm text-pasha-gray-dark">Raised</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pasha-blue-dark">{project.investorCount}</div>
              <div className="text-sm text-pasha-gray-dark">Investors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pasha-blue-dark">{daysLeft}</div>
              <div className="text-sm text-pasha-gray-dark">Days Left</div>
            </div>
          </div>

          <div className="mb-8">
            <ProgressBar current={project.currentAmount} goal={project.goalAmount} size="md" />
          </div>
          
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full md:w-auto mb-8"
            onClick={() => setIsModalOpen(true)}
            disabled={project.currentAmount >= project.goalAmount || daysLeft <=0}
          >
            {project.currentAmount >= project.goalAmount ? 'Funding Goal Reached' : (daysLeft <=0 ? 'Campaign Ended' : 'Invest Now')}
          </Button>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-pasha-blue-dark mb-3">About this Project</h2>
              <p className="text-pasha-gray-dark leading-relaxed whitespace-pre-line">{project.description}</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-pasha-blue-dark mb-3">Stated Impact</h2>
              <p className="text-pasha-gray-dark leading-relaxed">{project.impactStatement}</p>
            </div>

            {/* Gemini AI Sections */}
            <div className="border-t border-pasha-gray pt-6">
              <div className="flex items-center mb-3">
                <Icons.Sparkles className="h-6 w-6 text-pasha-gold mr-2" />
                <h2 className="text-2xl font-semibold text-pasha-blue-dark">AI-Powered Insights</h2>
              </div>
              
              <div className="bg-pasha-blue/5 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-pasha-blue mb-2">Enhanced Overview by Gemini</h3>
                {!geminiDescription && !isGeneratingDescription && (
                   <Button onClick={handleGenerateDescription} variant="secondary" size="sm" isLoading={isGeneratingDescription}>
                    Generate AI Overview
                  </Button>
                )}
                {isGeneratingDescription && <LoadingSpinner size="sm" text="Generating..." />}
                {geminiDescriptionError && <AlertMessage type="error" message={geminiDescriptionError} />}
                {geminiDescription && <p className="text-pasha-gray-dark leading-relaxed whitespace-pre-line">{geminiDescription}</p>}
              </div>

              <div className="bg-pasha-green/5 p-4 rounded-lg">
                 <h3 className="text-lg font-semibold text-pasha-green mb-2">Potential Impact Summary by Gemini</h3>
                {!geminiImpact && !isGeneratingImpact && (
                  <Button onClick={handleGenerateImpact} variant="secondary" size="sm" className="bg-pasha-green hover:bg-emerald-700 focus:ring-pasha-green" isLoading={isGeneratingImpact}>
                    Generate AI Impact Summary
                  </Button>
                )}
                {isGeneratingImpact && <LoadingSpinner size="sm" text="Generating..." color="text-pasha-green" />}
                {geminiImpactError && <AlertMessage type="error" message={geminiImpactError} />}
                {geminiImpact && <div className="text-pasha-gray-dark leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: geminiImpact.replace(/\n/g, '<br/>').replace(/\* /g, '&bull; ') }} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      <InvestmentModal
        project={project}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInvestmentSuccess={() => {
          setInvestmentSuccessMessage(`Successfully invested in ${project.name}! Your contribution is valued.`);
          fetchProjectData(); // Re-fetch to update project details like currentAmount
        }}
      />
    </div>
  );
};

export default ProjectPage;
