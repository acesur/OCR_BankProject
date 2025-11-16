import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, delay } from 'rxjs';
import { map } from 'rxjs/operators';

import { 
  FraudReport, 
  CreateReportRequest, 
  ReportStatus, 
  RiskLevel, 
  CrimeType,
  AnnAnalysis,
  OcrResult,
  ExtractedAccountData
} from '../models/fraud-report.model';

@Injectable({
  providedIn: 'root'
})
export class FraudReportService {
  private baseUrl = '/api/fraud-reports'; // This would be your actual API endpoint
  private reportsSubject = new BehaviorSubject<FraudReport[]>([]);
  public reports$ = this.reportsSubject.asObservable();

  // Mock data for demonstration
  private mockReports: FraudReport[] = [
    {
      id: 'RPT001',
      reportNumber: 'FRD-2024-001',
      accountNumber: '1234567890',
      accountHolderName: 'John Doe',
      bankName: 'State Bank of India',
      branchName: 'Mumbai Central',
      ifscCode: 'SBIN0001234',
      firNumber: 'FIR/2024/001',
      crimeType: CrimeType.ONLINE_SCAM,
      description: 'Victim transferred ₹50,000 to this account after receiving fake investment call promising 30% returns in 30 days.',
      amountInvolved: 50000,
      riskScore: 0.87,
      riskLevel: RiskLevel.HIGH,
      status: ReportStatus.PENDING,
      reportedBy: 'Inspector Sharma',
      reporterId: 1,
      reportedDate: new Date('2024-01-15T10:30:00'),
      lastUpdated: new Date('2024-01-15T14:20:00'),
      evidenceFiles: [
        {
          id: 'EV001',
          fileName: 'bank_statement.pdf',
          fileType: 'application/pdf',
          fileSize: 245760,
          uploadedAt: new Date('2024-01-15T10:35:00'),
          url: '/files/evidence/EV001.pdf',
          ocrProcessed: true
        }
      ],
      historyCount: 2,
      annAnalysis: {
        modelVersion: '2.1.0',
        confidenceScore: 0.87,
        factors: [
          { factor: 'Account Age', weight: 0.3, description: 'Recently opened account (< 30 days)' },
          { factor: 'Transaction Pattern', weight: 0.25, description: 'Unusual large incoming transfers' },
          { factor: 'Previous Reports', weight: 0.32, description: 'Multiple fraud reports associated' }
        ],
        processedAt: new Date('2024-01-15T10:40:00')
      }
    },
    {
      id: 'RPT002',
      reportNumber: 'FRD-2024-002',
      accountNumber: '9876543210',
      accountHolderName: 'Jane Smith',
      bankName: 'HDFC Bank',
      branchName: 'Delhi South',
      ifscCode: 'HDFC0001234',
      firNumber: 'FIR/2024/002',
      crimeType: CrimeType.PHISHING,
      description: 'Multiple victims reported transferring money after receiving phishing SMS claiming account verification.',
      amountInvolved: 125000,
      riskScore: 0.65,
      riskLevel: RiskLevel.MEDIUM,
      status: ReportStatus.UNDER_REVIEW,
      reportedBy: 'Inspector Sharma',
      reporterId: 1,
      reportedDate: new Date('2024-01-14T09:15:00'),
      lastUpdated: new Date('2024-01-16T11:45:00'),
      adminRemarks: 'Investigating similar pattern across multiple states',
      evidenceFiles: [
        {
          id: 'EV002',
          fileName: 'phishing_sms.jpg',
          fileType: 'image/jpeg',
          fileSize: 156320,
          uploadedAt: new Date('2024-01-14T09:20:00'),
          url: '/files/evidence/EV002.jpg',
          ocrProcessed: true
        }
      ],
      historyCount: 1,
      annAnalysis: {
        modelVersion: '2.1.0',
        confidenceScore: 0.65,
        factors: [
          { factor: 'Account Age', weight: 0.2, description: 'Account opened 6 months ago' },
          { factor: 'Transaction Frequency', weight: 0.25, description: 'High volume of small transactions' },
          { factor: 'Geographic Spread', weight: 0.2, description: 'Transactions from multiple states' }
        ],
        processedAt: new Date('2024-01-14T09:25:00')
      }
    },
    {
      id: 'RPT003',
      reportNumber: 'FRD-2024-003',
      accountNumber: '5555666677',
      accountHolderName: 'Rajesh Kumar',
      bankName: 'ICICI Bank',
      branchName: 'Bangalore Electronic City',
      ifscCode: 'ICIC0001234',
      firNumber: 'FIR/2024/003',
      crimeType: CrimeType.FAKE_INVESTMENT,
      description: 'Investment scam promising cryptocurrency returns. Multiple victims from tech companies.',
      amountInvolved: 75000,
      riskScore: 0.34,
      riskLevel: RiskLevel.LOW,
      status: ReportStatus.APPROVED,
      reportedBy: 'Inspector Patel',
      reporterId: 2,
      reportedDate: new Date('2024-01-13T16:20:00'),
      lastUpdated: new Date('2024-01-17T09:30:00'),
      adminRemarks: 'Approved for freeze action. Coordinating with ICICI Bank.',
      evidenceFiles: [],
      historyCount: 0
    }
  ];

  constructor(private http: HttpClient) {
    // Initialize with mock data
    this.reportsSubject.next(this.mockReports);
  }

  // Get all reports
  getReports(): Observable<FraudReport[]> {
    // In a real app, this would be: return this.http.get<FraudReport[]>(this.baseUrl);
    return of(this.mockReports).pipe(delay(500));
  }

  // Get reports by user (for police officers to see their own reports)
  getReportsByUser(userId: number): Observable<FraudReport[]> {
    return of(this.mockReports.filter(r => r.reporterId === userId)).pipe(delay(300));
  }

  // Get report by ID
  getReportById(id: string): Observable<FraudReport | undefined> {
    return of(this.mockReports.find(r => r.id === id)).pipe(delay(300));
  }

  // Get high risk reports
  getHighRiskReports(): Observable<FraudReport[]> {
    return of(this.mockReports.filter(r => r.riskLevel === RiskLevel.HIGH)).pipe(delay(400));
  }

  // Create new report
  createReport(request: CreateReportRequest): Observable<FraudReport> {
    const newReport: FraudReport = {
      id: `RPT${String(this.mockReports.length + 1).padStart(3, '0')}`,
      reportNumber: `FRD-2024-${String(this.mockReports.length + 1).padStart(3, '0')}`,
      accountNumber: request.accountNumber,
      accountHolderName: request.accountHolderName,
      bankName: request.bankName,
      branchName: request.branchName || '',
      ifscCode: request.ifscCode || '',
      firNumber: request.firNumber,
      crimeType: request.crimeType,
      description: request.description,
      amountInvolved: request.amountInvolved,
      riskScore: 0, // Will be updated after ANN analysis
      riskLevel: RiskLevel.LOW,
      status: ReportStatus.PENDING,
      reportedBy: 'Current User', // This should come from auth service
      reporterId: 1, // This should come from auth service
      reportedDate: new Date(),
      lastUpdated: new Date(),
      evidenceFiles: [],
      historyCount: 0
    };

    this.mockReports.push(newReport);
    this.reportsSubject.next([...this.mockReports]);
    
    // In a real app: return this.http.post<FraudReport>(this.baseUrl, request);
    return of(newReport).pipe(delay(1000));
  }

  // Update report status (Admin function)
  updateReportStatus(reportId: string, status: ReportStatus, adminRemarks?: string): Observable<FraudReport> {
    const reportIndex = this.mockReports.findIndex(r => r.id === reportId);
    
    if (reportIndex !== -1) {
      this.mockReports[reportIndex] = {
        ...this.mockReports[reportIndex],
        status,
        adminRemarks,
        lastUpdated: new Date()
      };
      
      this.reportsSubject.next([...this.mockReports]);
      return of(this.mockReports[reportIndex]).pipe(delay(500));
    }
    
    throw new Error('Report not found');
  }

  // Process OCR on uploaded files
  processOCR(fileId: string): Observable<OcrResult> {
    // Mock OCR processing
    const mockResult: OcrResult = {
      fileId,
      extractedData: {
        accountNumber: '1234567890',
        accountHolderName: 'JOHN DOE',
        bankName: 'State Bank of India',
        branchName: 'Mumbai Central',
        ifscCode: 'SBIN0001234',
        amount: 50000,
        date: '15/01/2024'
      },
      confidence: 0.92,
      processedAt: new Date(),
      status: 'success'
    };
    
    // Simulate processing time
    return of(mockResult).pipe(delay(3000));
  }

  // Run ANN analysis on report
  runAnnAnalysis(reportId: string): Observable<AnnAnalysis> {
    const mockAnalysis: AnnAnalysis = {
      modelVersion: '2.1.0',
      confidenceScore: Math.random() * 0.4 + 0.5, // Random score between 0.5 - 0.9
      factors: [
        { factor: 'Account Age', weight: 0.25, description: 'Account creation date analysis' },
        { factor: 'Transaction Pattern', weight: 0.30, description: 'Unusual transaction patterns detected' },
        { factor: 'Previous Reports', weight: 0.20, description: 'Historical fraud report analysis' },
        { factor: 'Network Analysis', weight: 0.25, description: 'Connected accounts risk assessment' }
      ],
      processedAt: new Date()
    };

    // Update the report with ANN analysis
    const reportIndex = this.mockReports.findIndex(r => r.id === reportId);
    if (reportIndex !== -1) {
      const riskLevel = mockAnalysis.confidenceScore > 0.7 ? RiskLevel.HIGH : 
                       mockAnalysis.confidenceScore > 0.4 ? RiskLevel.MEDIUM : RiskLevel.LOW;
      
      this.mockReports[reportIndex] = {
        ...this.mockReports[reportIndex],
        annAnalysis: mockAnalysis,
        riskScore: mockAnalysis.confidenceScore,
        riskLevel,
        lastUpdated: new Date()
      };
      
      this.reportsSubject.next([...this.mockReports]);
    }

    return of(mockAnalysis).pipe(delay(2000));
  }

  // Get statistics for dashboard
  getReportStatistics(): Observable<any> {
    const stats = {
      totalReports: this.mockReports.length,
      pendingReports: this.mockReports.filter(r => r.status === ReportStatus.PENDING).length,
      highRiskReports: this.mockReports.filter(r => r.riskLevel === RiskLevel.HIGH).length,
      approvedReports: this.mockReports.filter(r => r.status === ReportStatus.APPROVED).length,
      frozenAccounts: this.mockReports.filter(r => r.status === ReportStatus.FROZEN).length,
      totalAmountInvolved: this.mockReports.reduce((sum, r) => sum + (r.amountInvolved || 0), 0),
      reportsByBank: this.getReportsByBank(),
      reportsByCrimeType: this.getReportsByCrimeType(),
      recentReports: this.mockReports.slice(-5).reverse()
    };

    return of(stats).pipe(delay(300));
  }

  private getReportsByBank(): any {
    const bankCounts = this.mockReports.reduce((acc, report) => {
      acc[report.bankName] = (acc[report.bankName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(bankCounts).map(([bank, count]) => ({ bank, count }));
  }

  private getReportsByCrimeType(): any {
    const typeCounts = this.mockReports.reduce((acc, report) => {
      acc[report.crimeType] = (acc[report.crimeType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCounts).map(([type, count]) => ({ type, count }));
  }
}