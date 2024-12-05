

export interface EnvironmentCore {
  apiUrl: string;
  production: boolean;
  microservices: {
    [key: string]: string;
  };
}
