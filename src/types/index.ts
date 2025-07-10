// File types for MultiRename page
export interface FileInfo {
  name: string;
  path: string;
  size: number;
}

// Form data types
export interface FormData {
  text: string;
  email: string;
  password: string;
  select: string;
  checkbox: boolean;
  toggle: boolean;
  radio: string;
  number: number;
  date: string;
  time: string;
  slider: number;
}

// Page configuration
export interface PageConfig {
  path: string;
  name: string;
  element: React.ReactElement;
}

// Settings types
export interface Settings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  emailNotifications: boolean;
  autoSave: boolean;
  autoSaveInterval: number;
  privacyMode: boolean;
  dataCollection: boolean;
  username: string;
  displayName: string;
  bio: string;
}

// Text processing options
export interface TextProcessingOptions {
  prefix: string;
  suffix: string;
  removeText: string;
  caseType: 'lowercase' | 'uppercase' | 'titlecase';
  startNumber: number;
  renamePattern: string;
} 