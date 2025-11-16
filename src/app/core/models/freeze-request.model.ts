export interface FreezeRequest {
  id: string;
  reportId: string;
  freezeRequestNumber: string;
  
  // Account Information
  accountNumber: string;
  accountHolderName: string;
  bankName: string;
  branchName: string;
  
  // Request Details
  requestedBy: string;
  requesterId: number;
  requestedDate: Date;
  adminRemarks: string;
  riskScore: number;
  riskLevel: string;
  
  // Status and Processing
  status: FreezeStatus;
  assignedTo?: string;
  processedBy?: string;
  processedDate?: Date;
  bankRemarks?: string;
  
  // Additional Information
  urgencyLevel: UrgencyLevel;
  estimatedAmount?: number;
  lastUpdated: Date;
}

export enum FreezeStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in-progress',
  FREEZE_INITIATED = 'freeze-initiated',
  FREEZE_COMPLETED = 'freeze-completed',
  FREEZE_FAILED = 'freeze-failed',
  REJECTED = 'rejected'
}

export enum UrgencyLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface UpdateFreezeStatusRequest {
  freezeId: string;
  status: FreezeStatus;
  bankRemarks?: string;
  processedBy: string;
}