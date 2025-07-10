// Environment configuration
export const ENV = {
  // App environment
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Butler',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '0.1.0',
  
  // API configuration
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  
  // Debug and development
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
  ENABLE_DEV_TOOLS: import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true',
} as const;

// Environment type
export type Environment = 'development' | 'staging' | 'production';

// Environment helpers
export const isDevelopment = ENV.APP_ENV === 'development';
export const isStaging = ENV.APP_ENV === 'staging';
export const isProduction = ENV.APP_ENV === 'production';

// Environment display info
export const getEnvironmentInfo = () => ({
  name: ENV.APP_NAME,
  version: ENV.APP_VERSION,
  environment: ENV.APP_ENV,
  isDevelopment,
  isStaging,
  isProduction,
});

// Environment color mapping for UI
export const getEnvironmentColor = (): 'green' | 'orange' | 'red' | 'gray' => {
  switch (ENV.APP_ENV) {
    case 'development':
      return 'green';
    case 'staging':
      return 'orange';
    case 'production':
      return 'red';
    default:
      return 'gray';
  }
};

// Environment badge text
export const getEnvironmentBadge = (): string => {
  switch (ENV.APP_ENV) {
    case 'development':
      return 'DEV';
    case 'staging':
      return 'STAGING';
    case 'production':
      return 'PROD';
    default:
      return 'UNKNOWN';
  }
}; 