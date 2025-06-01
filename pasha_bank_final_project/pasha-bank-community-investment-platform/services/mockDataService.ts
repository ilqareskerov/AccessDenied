
import { Project, Investment, User, ProjectCategory } from '../types';
import { MOCK_USER_ID } from '../constants';

const today = new Date();
const generateEndDate = (days: number): string => {
  const date = new Date();
  date.setDate(today.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const mockProjects: Project[] = [
  {
    id: 'proj_001',
    name: 'Baku Artisan Bakery Expansion',
    tagline: 'Freshly baked goods for a growing community.',
    description: 'Help us expand our beloved local bakery to a new neighborhood, bringing traditional Azerbaijani pastries and fresh bread to more people. Funds will be used for new equipment and storefront renovation.',
    category: ProjectCategory.LOCAL_BUSINESS,
    goalAmount: 25000,
    currentAmount: 12500,
    investorCount: 45,
    imageUrl: 'https://picsum.photos/seed/bakery/600/400',
    endDate: generateEndDate(30),
    location: 'Baku, Azerbaijan',
    impactStatement: 'Supports local economy, creates 5 new jobs, and preserves culinary traditions.',
    owner: 'Aysel Mammadova'
  },
  {
    id: 'proj_002',
    name: 'Ganja Tech Hub for Youth',
    tagline: 'Empowering the next generation of innovators.',
    description: 'Establish a modern tech hub in Ganja offering coding bootcamps, workshops, and co-working spaces for young aspiring tech professionals. Investment covers hardware, software licenses, and initial operational costs.',
    category: ProjectCategory.TECHNOLOGY,
    goalAmount: 75000,
    currentAmount: 30000,
    investorCount: 80,
    imageUrl: 'https://picsum.photos/seed/techhub/600/400',
    endDate: generateEndDate(60),
    location: 'Ganja, Azerbaijan',
    impactStatement: 'Provides tech education to 200+ youth annually, fosters innovation, and bridges the digital divide.',
    owner: 'Elchin Aliyev'
  },
  {
    id: 'proj_003',
    name: 'Absheron Solar Farm Initiative',
    tagline: 'Clean energy for a sustainable future.',
    description: 'Develop a small-scale community solar farm on the Absheron Peninsula. This project aims to provide clean energy to local facilities and reduce carbon footprint.',
    category: ProjectCategory.GREEN_ENERGY,
    goalAmount: 150000,
    currentAmount: 95000,
    investorCount: 120,
    imageUrl: 'https://picsum.photos/seed/solarfarm/600/400',
    endDate: generateEndDate(90),
    location: 'Absheron Peninsula, Azerbaijan',
    impactStatement: 'Generates renewable energy, reduces CO2 emissions by an estimated 500 tons/year, and promotes environmental awareness.',
    owner: 'Leyla Hasanova'
  },
  {
    id: 'proj_004',
    name: 'Sheki Silk Road Cultural Center',
    tagline: 'Reviving ancient crafts and traditions.',
    description: 'Restore a historic caravanserai in Sheki to create a vibrant cultural center showcasing traditional silk weaving, pottery, and local arts. Funds will support restoration and artisan workshops.',
    category: ProjectCategory.ARTS_CULTURE,
    goalAmount: 40000,
    currentAmount: 15000,
    investorCount: 30,
    imageUrl: 'https://picsum.photos/seed/sheki/600/400',
    endDate: generateEndDate(45),
    location: 'Sheki, Azerbaijan',
    impactStatement: 'Preserves cultural heritage, supports local artisans, and boosts tourism in the region.',
    owner: 'Kamran Safarov'
  }
];

export const mockUser: User = {
  id: MOCK_USER_ID,
  name: 'Valued Pasha Bank Investor',
  avatarUrl: 'https://picsum.photos/seed/useravatar/100/100'
};

export let mockInvestments: Investment[] = [
  {
    id: 'inv_001',
    projectId: 'proj_001',
    projectName: 'Baku Artisan Bakery Expansion',
    userId: MOCK_USER_ID,
    amount: 500,
    date: new Date(today.setDate(today.getDate() - 10)).toISOString().split('T')[0]
  },
  {
    id: 'inv_002',
    projectId: 'proj_003',
    projectName: 'Absheron Solar Farm Initiative',
    userId: MOCK_USER_ID,
    amount: 1000,
    date: new Date(today.setDate(today.getDate() - 5)).toISOString().split('T')[0]
  }
];

export const fetchProjects = async (): Promise<Project[]> => {
  return new Promise(resolve => setTimeout(() => resolve([...mockProjects]), 500));
};

export const fetchProjectById = async (id: string): Promise<Project | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(mockProjects.find(p => p.id === id)), 300));
};

export const fetchUserInvestments = async (userId: string): Promise<Investment[]> => {
  return new Promise(resolve => setTimeout(() => resolve(mockInvestments.filter(inv => inv.userId === userId)), 400));
};

export const addInvestment = async (investment: Omit<Investment, 'id' | 'date'>): Promise<Investment> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const project = mockProjects.find(p => p.id === investment.projectId);
      if (project) {
        project.currentAmount += investment.amount;
        project.investorCount += 1;
      }
      const newInvestment: Investment = {
        ...investment,
        id: `inv_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
      };
      mockInvestments.push(newInvestment);
      resolve(newInvestment);
    }, 600);
  });
};
