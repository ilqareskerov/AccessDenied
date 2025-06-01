
export enum ProjectCategory {
  LOCAL_BUSINESS = "Local Business",
  COMMUNITY_PROJECT = "Community Project",
  GREEN_ENERGY = "Green Energy",
  TECHNOLOGY = "Technology",
  ARTS_CULTURE = "Arts & Culture",
  EDUCATION = "Education",
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  goalAmount: number;
  currentAmount: number;
  investorCount: number;
  imageUrl: string;
  endDate: string; 
  location: string;
  impactStatement: string;
  updates?: ProjectUpdate[];
  owner: string; 
}

export interface ProjectUpdate {
  id: string;
  date: string;
  title: string;
  description: string;
}

export interface Investment {
  id: string;
  projectId: string;
  projectName: string; // Denormalized for easier display
  userId: string;
  amount: number;
  date: string;
}

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web: GroundingChunkWeb;
}
