
import React from 'react';
import { ProjectCategory } from '../types'; // Added import

export const APP_NAME = "Pasha Bank Community Investment";
export const MOCK_USER_ID = "user_pasha_001";

export const Icons = {
  Logo: ({ className }: { className?: string }): React.ReactNode => (
    <svg className={className} viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="10" y="35" fontFamily="Arial, sans-serif" fontSize="30" fill="#0033A0" fontWeight="bold">PASHA</text>
      <text x="120" y="35" fontFamily="Arial, sans-serif" fontSize="30" fill="#C0952B">Bank</text>
    </svg>
  ),
  UserCircle: ({ className }: { className?: string }): React.ReactNode => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  ArrowRight: ({ className }: { className?: string }): React.ReactNode => (
     <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  ),
  CheckCircle: ({ className }: { className?: string }): React.ReactNode => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  InformationCircle: ({ className }: { className?: string }): React.ReactNode => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  ),
  ExclamationTriangle: ({ className }: { className?: string }): React.ReactNode => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
   Sparkles: ({ className }: { className?: string }): React.ReactNode => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 7.5l.813 2.846a4.5 4.5 0 012.187 2.187L24 13.5l-2.846.813a4.5 4.5 0 01-2.187 2.187L16.5 19.5l-.813-2.846a4.5 4.5 0 01-2.187-2.187L10.5 13.5l2.846-.813a4.5 4.5 0 012.187-2.187L18.25 7.5z" />
    </svg>
  ),
};

export const CATEGORY_COLORS: { [key in ProjectCategory]: string } = {
  [ProjectCategory.LOCAL_BUSINESS]: "bg-blue-100 text-blue-800",
  [ProjectCategory.COMMUNITY_PROJECT]: "bg-green-100 text-green-800",
  [ProjectCategory.GREEN_ENERGY]: "bg-teal-100 text-teal-800",
  [ProjectCategory.TECHNOLOGY]: "bg-indigo-100 text-indigo-800",
  [ProjectCategory.ARTS_CULTURE]: "bg-purple-100 text-purple-800",
  [ProjectCategory.EDUCATION]: "bg-pink-100 text-pink-800",
};
