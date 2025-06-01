import axios from 'axios';

// Define the base URL for the backend API
// In development, this might point to localhost:5000
// In production, this would point to the deployed backend URL
const API_BASE_URL = 'http://localhost:5000/api'; // Adjust if backend runs elsewhere

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors for handling JWT tokens or global errors
apiClient.interceptors.request.use(
  (config) => {
    // Get token from local storage or state management
    const token = localStorage.getItem('accessToken'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API Service Functions

// --- Projects --- 
export const getProjects = async (status: string = 'funding') => {
  try {
    const response = await apiClient.get(`/projects?status=${status}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error; // Re-throw error to be handled by the component
  }
};

export const getProjectDetails = async (projectId: string) => {
  try {
    const response = await apiClient.get(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching project ${projectId}:`, error);
    throw error;
  }
};

export const createProject = async (projectData: any) => {
  try {
    const response = await apiClient.post('/projects', projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// --- Authentication --- 
export const loginUser = async (credentials: any) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    // Store the token (e.g., in localStorage)
    if (response.data.access_token) {
      localStorage.setItem('accessToken', response.data.access_token);
    }
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const registerUser = async (userData: any) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    // Handle token expiration or invalid token if needed
    throw error;
  }
};

// --- Investments --- 
export const makeInvestment = async (projectId: string, amount: number) => {
  try {
    const response = await apiClient.post(`/investments/project/${projectId}`, { amount });
    return response.data;
  } catch (error) {
    console.error(`Error making investment in project ${projectId}:`, error);
    throw error;
  }
};

export const getMyInvestments = async () => {
  try {
    const response = await apiClient.get('/investments/my');
    return response.data;
  } catch (error) {
    console.error('Error fetching my investments:', error);
    throw error;
  }
};

export default apiClient;

