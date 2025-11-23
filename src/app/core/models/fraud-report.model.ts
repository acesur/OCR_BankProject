export interface FraudReport {
  id: string;
  reportNumber: string;
  
  // Account Details
  accountNumber: string;
  accountHolderName: string;
  bankName: string;
  branchName: string;
  ifscCode: string;
  
  // Complaint Details
  firNumber: string;
  crimeType: CrimeType;
  description: string;
  amountInvolved?: number;
  
  // Risk Assessment
  riskScore: number;
  riskLevel: RiskLevel;
  annAnalysis?: AnnAnalysis;
  
  // Status and Tracking
  status: ReportStatus;
  reportedBy: string;
  reporterId: number;
  reportedDate: Date;
  lastUpdated: Date;
  adminRemarks?: string;
  
  // Evidence
  evidenceFiles: EvidenceFile[];
  ocrResults?: OcrResult[];
  
  // Previous Reports
  relatedReports?: string[];
  historyCount: number;
}

export enum CrimeType {
  ONLINE_SCAM = 'Online Scam',
  PHISHING = 'Phishing',
  MONEY_LAUNDERING = 'Money Laundering',
  FAKE_INVESTMENT = 'Fake Investment',
  IDENTITY_THEFT = 'Identity Theft',
  CYBER_FRAUD = 'Cyber Fraud',
  OTHER = 'Other'
}

export enum ReportStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under-review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  FREEZE_REQUESTED = 'freeze-requested',
  FROZEN = 'frozen',
  CLOSED = 'closed'
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface AnnAnalysis {
  modelVersion: string;
  confidenceScore: number;
  factors: RiskFactor[];
  processedAt: Date;
}

export interface RiskFactor {
  factor: string;
  weight: number;
  description: string;
}

export interface EvidenceFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
  url: string;
  ocrProcessed: boolean;
}

export interface OcrResult {
  fileId: string;
  extractedData: ExtractedAccountData;
  confidence: number;
  processedAt: Date;
  status: 'success' | 'failed' | 'partial';
}

export interface ExtractedAccountData {
  accountNumber?: string;
  accountHolderName?: string;
  bankName?: string;
  branchName?: string;
  ifscCode?: string;
  amount?: number;
  date?: string;
}

// New OCR API Models
export interface OcrField {
  value: string;
  confidence: number;
}

export interface OcrData {
  bankName: OcrField;
  accountHolderName: OcrField;
  accountNumber: OcrField;
  routingNumber: OcrField;
  amount: OcrField;
  date: OcrField;
}

export interface OcrSuccessResponse {
  success: true;
  data: OcrData;
  message: string;
  processingTime: number;
}

export interface OcrErrorResponse {
  success: false;
  message: string;
  error: string;
}

export type OcrResponse = OcrSuccessResponse | OcrErrorResponse;

export interface ExportData {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
  amount: string;
  date: string;
  extractedAt: string;
  confidenceScores: {
    bankName: number;
    accountHolderName: number;
    accountNumber: number;
    routingNumber: number;
    amount: number;
    date: number;
  };
}

export enum FileUploadError {
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_FORMAT = 'INVALID_FILE_FORMAT',
  CORRUPTED_IMAGE = 'CORRUPTED_IMAGE',
  NO_TEXT_DETECTED = 'NO_TEXT_DETECTED',
  OCR_PROCESSING_FAILED = 'OCR_PROCESSING_FAILED'
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  errorType?: FileUploadError;
}

export interface CreateReportRequest {
  accountNumber: string;
  accountHolderName: string;
  bankName: string;
  branchName?: string;
  ifscCode?: string;
  firNumber: string;
  crimeType: CrimeType;
  description: string;
  amountInvolved?: number;
}