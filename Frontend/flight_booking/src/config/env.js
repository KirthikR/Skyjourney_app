// Environment variables safe for client-side usage
export const ENV = {
  OPENAI_API_KEY: window.ENV_OPENAI_API_KEY || '',
  APP_ENV: window.ENV_APP_ENV || 'production',
  // Add other variables as needed
};

// Usage example: import { ENV } from './config/env'; 
// Then use: ENV.OPENAI_API_KEY