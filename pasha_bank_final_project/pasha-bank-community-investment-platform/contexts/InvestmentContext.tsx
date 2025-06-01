
import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Project, Investment, User } from '../types';
import * as mockDataService from '../services/mockDataService';
import { MOCK_USER_ID } from '../constants';

interface InvestmentContextType {
  projects: Project[];
  investments: Investment[];
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
  makeInvestment: (projectId: string, projectName: string, amount: number) => Promise<boolean>;
  refreshProject: (projectId: string) => Promise<void>;
}

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined);

export const InvestmentProvider = ({ children }: { children: ReactNode }): React.ReactNode => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedProjects, fetchedInvestments] = await Promise.all([
        mockDataService.fetchProjects(),
        mockDataService.fetchUserInvestments(MOCK_USER_ID)
      ]);
      setProjects(fetchedProjects);
      setInvestments(fetchedInvestments);
      setUser(mockDataService.mockUser);
    } catch (e) {
      console.error("Failed to fetch initial data:", e);
      setError("Failed to load platform data. Please try refreshing.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const getProjectById = (id: string): Project | undefined => {
    return projects.find(p => p.id === id);
  };

  const makeInvestment = async (projectId: string, projectName: string, amount: number): Promise<boolean> => {
    if (!user) {
      setError("User not found. Cannot make investment.");
      return false;
    }
    setLoading(true);
    try {
      const newInvestment = await mockDataService.addInvestment({
        projectId,
        projectName,
        userId: user.id,
        amount,
      });
      setInvestments(prev => [...prev, newInvestment]);
      // Update project's currentAmount and investorCount
      setProjects(prevProjects =>
        prevProjects.map(p =>
          p.id === projectId
            ? { ...p, currentAmount: p.currentAmount + amount, investorCount: p.investorCount + 1 }
            : p
        )
      );
      setLoading(false);
      return true;
    } catch (e) {
      console.error("Failed to make investment:", e);
      setError("Investment failed. Please try again.");
      setLoading(false);
      return false;
    }
  };
  
  const refreshProject = async (projectId: string): Promise<void> => {
    setLoading(true);
    try {
      const updatedProject = await mockDataService.fetchProjectById(projectId);
      if (updatedProject) {
        setProjects(prevProjects => 
          prevProjects.map(p => p.id === projectId ? updatedProject : p)
        );
      }
    } catch (e) {
      console.error("Failed to refresh project data:", e);
      // Optionally set an error message for the user
    } finally {
      setLoading(false);
    }
  };


  return (
    <InvestmentContext.Provider value={{ 
        projects, 
        investments, 
        user, 
        loading, 
        error, 
        fetchProjects: fetchInitialData, 
        getProjectById, 
        makeInvestment,
        refreshProject
    }}>
      {children}
    </InvestmentContext.Provider>
  );
};

export const useInvestment = (): InvestmentContextType => {
  const context = useContext(InvestmentContext);
  if (context === undefined) {
    throw new Error('useInvestment must be used within an InvestmentProvider');
  }
  return context;
};
