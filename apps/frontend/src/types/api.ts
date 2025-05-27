// Local type definitions to avoid import issues
export interface LocationPair {
  index: number;
  left: number;
  right: number;
  distance: number;
}

export interface ProcessingResult {
  totalDistance: number;
  pairsCount: number;
  pairs: LocationPair[];
  statistics: {
    average: number;
    maximum: number;
    minimum: number;
  };
}

export interface LocationLists {
  list1: number[];
  list2: number[];
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  service: string;
  algorithmVerified?: boolean;
}

