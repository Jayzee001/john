// Environment configuration
export const config = {
  // API Configuration
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://johnshop-cugfcxfeebemevbc.uksouth-01.azurewebsites.net/api',
    timeout: 10000,
    uploadTimeout: 60000, // 60 seconds for file uploads
  },
  
  // App Configuration
  app: {
    name: 'John Ecommerce',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
  
  // Feature flags
  features: {
    enableMockData: process.env.NODE_ENV === 'development',
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    enableStripe: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY !== undefined,
  },
  
  // External services
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  
  // Storage keys
  storage: {
    authToken: 'auth-token',
    userData: 'user-data',
    cartData: 'cart-data',
  },
} as const;

// Type-safe environment variables
export type Config = typeof config;

// Helper function to get config value
export function getConfig<K extends keyof Config>(key: K): Config[K] {
  return config[key];
}

// Helper function to check if feature is enabled
export function isFeatureEnabled(feature: keyof Config['features']): boolean {
  return config.features[feature];
} 