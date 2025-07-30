export class DatabaseHealthDto {
  status: 'healthy' | 'unhealthy';
  connection: boolean;
  responseTime: number;
  message?: string;
}

export class SystemHealthDto {
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
  };
}

export class ServicesHealthDto {
  email: {
    status: 'healthy' | 'unhealthy';
    configured: boolean;
    message?: string;
  };
  jwt: {
    status: 'healthy' | 'unhealthy';
    configured: boolean;
    message?: string;
  };
}

export class HealthCheckResponseDto {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  database: DatabaseHealthDto;
  system: SystemHealthDto;
  services: ServicesHealthDto;
  endpoints: {
    auth: boolean;
    users: boolean;
    clients: boolean;
    projects: boolean;
    tasks: boolean;
  };
}
