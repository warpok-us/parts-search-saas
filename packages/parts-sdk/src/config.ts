export interface APIEnvironment {
  name: string;
  baseUrl: string;
  timeout?: number;
  retryAttempts?: number;
}

export const API_ENVIRONMENTS: Record<string, APIEnvironment> = {
  development: {
    name: 'Development',
    baseUrl: 'http://localhost:8080/api/v1',
    timeout: 10000,
    retryAttempts: 2
  },
  staging: {
    name: 'Staging',
    baseUrl: 'https://api-staging.partsy.com/v1',
    timeout: 8000,
    retryAttempts: 3
  },
  production: {
    name: 'Production',
    baseUrl: 'https://api.partsy.com/v1',
    timeout: 5000,
    retryAttempts: 3
  }
};

export function getAPIConfig(env: string = 'development'): APIEnvironment {
  const environment = API_ENVIRONMENTS[env];
  if (!environment) {
    console.warn(`Unknown environment: ${env}, falling back to development`);
    return API_ENVIRONMENTS.development!;
  }
  return environment;
}
