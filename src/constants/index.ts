// Application constants
export const APP_NAME = 'Butler';
export const APP_VERSION = '0.1.0';

// Navigation constants
export const ROUTES = {
  HOME: '/',
  TEXTPAD: '/textpad',
  MULTI_RENAME: '/multi-rename',
  SETTINGS: '/settings',
} as const;

// Page configurations
export const PAGES = [
  { path: ROUTES.HOME, name: 'Home' },
  { path: ROUTES.TEXTPAD, name: 'Textpad' },
  { path: ROUTES.MULTI_RENAME, name: 'Multi Rename' },
  { path: ROUTES.SETTINGS, name: 'Settings' },
] as const;

// Theme options
export const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto (System)' },
] as const;

// Language options
export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' },
] as const;

// Case type options
export const CASE_TYPE_OPTIONS = [
  { value: 'lowercase', label: 'Lowercase' },
  { value: 'uppercase', label: 'Uppercase' },
  { value: 'titlecase', label: 'Title Case' },
] as const;

// Tag colors
export const TAG_COLORS = [
  'red',
  'magenta',
  'purple',
  'blue',
  'cyan',
  'teal',
  'green',
  'gray',
  'cool-gray',
  'warm-gray',
] as const;

// Default settings
export const DEFAULT_SETTINGS = {
  theme: 'auto' as const,
  language: 'en',
  notifications: true,
  emailNotifications: false,
  autoSave: true,
  autoSaveInterval: 5,
  privacyMode: false,
  dataCollection: true,
  username: 'user@example.com',
  displayName: 'John Doe',
  bio: '',
} as const;

// File upload constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'text/plain',
  'text/csv',
  'application/json',
  'application/xml',
] as const; 