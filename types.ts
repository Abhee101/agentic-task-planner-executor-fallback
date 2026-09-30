
export interface TaskStep {
  step: number;
  task: string;
  time_required: string;
  resources: string[];
}

export interface ValidationResult {
  feasible: boolean;
  notes: string;
}

export interface AgentResponse {
  goal: string;
  plan: TaskStep[];
  validation: ValidationResult;
  execution_notes: string;
  reflection: string;
  is_fallback?: boolean;
  fallback_message?: string;
}

export enum AgentState {
  IDLE = 'IDLE',
  PLANNING = 'PLANNING',
  VALIDATING = 'VALIDATING',
  EXECUTING = 'EXECUTING',
  REFLECTING = 'REFLECTING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
