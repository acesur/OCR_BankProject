import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { FraudReportService } from '../../../core/services/fraud-report.service';
import { OcrService } from '../../../core/services/ocr.service';
import { 
  CrimeType, 
  CreateReportRequest,
  OcrData,
  OcrSuccessResponse,
  FileValidationResult,
  FileUploadError
} from '../../../core/models/fraud-report.model';

@Component({
  selector: 'app-new-report',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatStepperModule,
    MatSnackBarModule,
    MatChipsModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './new-report.component.html',
  styleUrls: ['./new-report.component.scss']
})
export class NewReportComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  reportForm!: FormGroup;
  isSubmitting = false;
  
  // OCR State
  uploadedFiles: File[] = [];
  isOcrProcessing = false;
  ocrCompleted = false;
  ocrResults: OcrData | null = null;
  processingTime = 0;
  isDragOver = false;
  previewUrl: string | null = null;
  hasOcrError = false;
  ocrErrorMessage = '';
  
  // ANN State
  isAnnProcessing = false;
  annResults: any = null;
  
  // Form Options
  banks = [
    'State Bank of India',
    'HDFC Bank', 
    'ICICI Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Axis Bank',
    'Canara Bank',
    'Union Bank of India'
  ];

  crimeTypes = Object.values(CrimeType);
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private fraudReportService: FraudReportService,
    private ocrService: OcrService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.reportForm = this.fb.group({
      // Account Details
      accountNumber: ['', [Validators.required, Validators.pattern(/^\d{10,18}$/)]],
      accountHolderName: ['', [Validators.required, Validators.minLength(2)]],
      bankName: ['', Validators.required],
      branchName: ['', Validators.required],
      ifscCode: ['', [Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
      routingNumber: [''], // Add routing number field
      
      // Complaint Details
      firNumber: ['', [Validators.required, Validators.pattern(/^[A-Z0-9\/\-]+$/i)]],
      crimeType: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      amountInvolved: ['', [Validators.min(1)]]
    });
  }

  // File Upload Handling
  onFileSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    
    for (const file of files) {
      this.handleFile(file);
    }
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
    this.resetOcrState();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    const files = Array.from(event.dataTransfer?.files || []) as File[];
    for (const file of files) {
      this.handleFile(file);
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  private handleFile(file: File): void {
    const validation = this.ocrService.validateFile(file);
    
    if (!validation.isValid) {
      this.showError(validation.error!);
      return;
    }

    // Only allow one file for now (as per API spec)
    this.uploadedFiles = [file];
    this.createPreview(file);
    this.snackBar.open('File uploaded successfully', 'Close', { duration: 3000 });
  }

  private createPreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  private resetOcrState(): void {
    this.ocrCompleted = false;
    this.ocrResults = null;
    this.processingTime = 0;
    this.hasOcrError = false;
    this.ocrErrorMessage = '';
    this.previewUrl = null;
  }

  // OCR Processing
  processOCR(): void {
    if (this.uploadedFiles.length === 0) {
      this.snackBar.open('Please upload a file first', 'Close', { duration: 3000 });
      return;
    }

    this.isOcrProcessing = true;
    this.hasOcrError = false;
    this.ocrErrorMessage = '';
    this.processingTime = 0;

    const file = this.uploadedFiles[0];
    
    this.ocrService.processDocument(file)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: OcrSuccessResponse) => {
          this.isOcrProcessing = false;
          this.ocrCompleted = true;
          this.ocrResults = response.data;
          this.processingTime = response.processingTime;
          this.snackBar.open(`OCR completed successfully in ${response.processingTime}s!`, 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.isOcrProcessing = false;
          this.hasOcrError = true;
          this.ocrErrorMessage = error.message;
          this.snackBar.open(`OCR processing failed: ${error.message}`, 'Close', { duration: 5000 });
          console.error('OCR Error:', error);
        }
      });
  }

  // Use OCR extracted data
  useExtractedData(): void {
    if (this.ocrResults) {
      this.reportForm.patchValue({
        accountNumber: this.ocrResults.accountNumber.value || '',
        accountHolderName: this.ocrResults.accountHolderName.value || '',
        bankName: this.ocrResults.bankName.value || '',
        routingNumber: this.ocrResults.routingNumber.value || ''
      });

      // Trigger ANN analysis after using extracted data
      this.runAnnAnalysis();
      
      this.snackBar.open('Extracted data applied to form', 'Close', { duration: 3000 });
    }
  }

  // ANN Risk Analysis
  runAnnAnalysis(): void {
    // Check if we have enough data for analysis
    const accountNumber = this.reportForm.get('accountNumber')?.value;
    if (!accountNumber) {
      this.snackBar.open('Please provide account number for risk analysis', 'Close', { duration: 3000 });
      return;
    }

    this.isAnnProcessing = true;
    
    // Simulate ANN analysis
    this.fraudReportService.runAnnAnalysis('temp-report-id')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (analysis) => {
          this.isAnnProcessing = false;
          this.annResults = analysis;
          this.snackBar.open(
            `Risk analysis completed - ${this.getRiskLevel(analysis.confidenceScore)} Risk`, 
            'Close', 
            { duration: 5000 }
          );
        },
        error: (error) => {
          this.isAnnProcessing = false;
          this.snackBar.open('Risk analysis failed. You can still submit the report.', 'Close', { duration: 5000 });
          console.error('ANN Analysis Error:', error);
        }
      });
  }

  getRiskLevel(score: number): string {
    if (score > 0.7) return 'High';
    if (score > 0.4) return 'Medium';
    return 'Low';
  }

  getRiskColor(score: number): string {
    if (score > 0.7) return 'warn';
    if (score > 0.4) return 'accent';
    return 'primary';
  }

  // Form Submission
  onSubmit(): void {
    if (this.reportForm.invalid) {
      this.markFormGroupTouched();
      this.snackBar.open('Please fill in all required fields correctly', 'Close', { duration: 5000 });
      return;
    }

    this.isSubmitting = true;
    
    const reportData: CreateReportRequest = {
      accountNumber: this.reportForm.get('accountNumber')?.value,
      accountHolderName: this.reportForm.get('accountHolderName')?.value,
      bankName: this.reportForm.get('bankName')?.value,
      branchName: this.reportForm.get('branchName')?.value,
      ifscCode: this.reportForm.get('ifscCode')?.value,
      firNumber: this.reportForm.get('firNumber')?.value,
      crimeType: this.reportForm.get('crimeType')?.value,
      description: this.reportForm.get('description')?.value,
      amountInvolved: this.reportForm.get('amountInvolved')?.value || undefined
    };

    this.fraudReportService.createReport(reportData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (createdReport) => {
          this.isSubmitting = false;
          this.snackBar.open(
            `Report submitted successfully! Report ID: ${createdReport.reportNumber}`, 
            'Close', 
            { duration: 5000 }
          );
          this.router.navigate(['/police/reports']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open('Failed to submit report. Please try again.', 'Close', { duration: 5000 });
          console.error('Submit Error:', error);
        }
      });
  }

  resetForm(): void {
    this.reportForm.reset();
    this.uploadedFiles = [];
    this.resetOcrState();
    this.annResults = null;
    
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.reportForm.controls).forEach(key => {
      const control = this.reportForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.reportForm.get(fieldName);
    if (field?.touched && field?.errors) {
      const errors = field.errors;
      
      if (errors['required']) return `${this.getFieldDisplayName(fieldName)} is required`;
      if (errors['pattern']) return `Invalid ${this.getFieldDisplayName(fieldName)} format`;
      if (errors['minlength']) return `${this.getFieldDisplayName(fieldName)} is too short`;
      if (errors['min']) return `Amount must be greater than 0`;
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'accountNumber': 'Account Number',
      'accountHolderName': 'Account Holder Name',
      'bankName': 'Bank Name',
      'branchName': 'Branch Name',
      'ifscCode': 'IFSC Code',
      'firNumber': 'FIR Number',
      'crimeType': 'Crime Type',
      'description': 'Description',
      'amountInvolved': 'Amount Involved'
    };
    return displayNames[fieldName] || fieldName;
  }

  getFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  // OCR Helper Methods
  getConfidenceColor(confidence: number): string {
    return this.ocrService.getConfidenceColor(confidence);
  }

  getConfidenceText(confidence: number): string {
    return this.ocrService.getConfidenceText(confidence);
  }

  getConfidencePercentage(confidence: number): string {
    return Math.round(confidence * 100) + '%';
  }

  // Export Methods
  exportAsJson(): void {
    if (!this.ocrResults) {
      this.snackBar.open('No OCR results to export', 'Close', { duration: 3000 });
      return;
    }
    
    const jsonContent = this.ocrService.exportToJson(this.ocrResults);
    const filename = `ocr_result_${new Date().toISOString().split('T')[0]}.json`;
    this.ocrService.downloadFile(jsonContent, filename, 'application/json');
    this.snackBar.open('OCR results exported as JSON', 'Close', { duration: 3000 });
  }

  exportAsCsv(): void {
    if (!this.ocrResults) {
      this.snackBar.open('No OCR results to export', 'Close', { duration: 3000 });
      return;
    }
    
    const csvContent = this.ocrService.exportToCsv(this.ocrResults);
    const filename = `ocr_result_${new Date().toISOString().split('T')[0]}.csv`;
    this.ocrService.downloadFile(csvContent, filename, 'text/csv');
    this.snackBar.open('OCR results exported as CSV', 'Close', { duration: 3000 });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}