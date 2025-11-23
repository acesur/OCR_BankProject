import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { 
  OcrResponse, 
  OcrSuccessResponse, 
  OcrErrorResponse,
  FileValidationResult, 
  FileUploadError,
  ExportData,
  OcrData
} from '../models/fraud-report.model';

@Injectable({
  providedIn: 'root'
})
export class OcrService {
  // TODO: Update this URL to match your deployed backend
  private readonly API_URL = 'http://localhost:8000'; // Update with your backend URL
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png'];

  constructor(private http: HttpClient) {}

  validateFile(file: File): FileValidationResult {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size exceeds 10MB limit. Current size: ${this.formatFileSize(file.size)}`,
        errorType: FileUploadError.FILE_TOO_LARGE
      };
    }

    // Check file format
    if (!this.ALLOWED_FORMATS.includes(file.type)) {
      return {
        isValid: false,
        error: `Invalid file format. Only JPG, PNG, JPEG are supported. Current format: ${file.type}`,
        errorType: FileUploadError.INVALID_FILE_FORMAT
      };
    }

    return { isValid: true };
  }

  processDocument(file: File): Observable<OcrSuccessResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<OcrResponse>(`${this.API_URL}/upload-document/`, formData)
      .pipe(
        map((response: OcrResponse) => {
          if (response.success) {
            return response;
          } else {
            throw new Error(response.message);
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  exportToJson(data: OcrData): string {
    const exportData: ExportData = this.prepareExportData(data);
    return JSON.stringify(exportData, null, 2);
  }

  exportToCsv(data: OcrData): string {
    const exportData = this.prepareExportData(data);
    const headers = [
      'Bank Name',
      'Account Holder Name',
      'Account Number',
      'Routing Number',
      'Amount',
      'Date',
      'Extracted At',
      'Bank Name Confidence',
      'Account Holder Name Confidence',
      'Account Number Confidence',
      'Routing Number Confidence',
      'Amount Confidence',
      'Date Confidence'
    ];

    const values = [
      exportData.bankName,
      exportData.accountHolderName,
      exportData.accountNumber,
      exportData.routingNumber,
      exportData.amount,
      exportData.date,
      exportData.extractedAt,
      exportData.confidenceScores.bankName.toString(),
      exportData.confidenceScores.accountHolderName.toString(),
      exportData.confidenceScores.accountNumber.toString(),
      exportData.confidenceScores.routingNumber.toString(),
      exportData.confidenceScores.amount.toString(),
      exportData.confidenceScores.date.toString()
    ];

    return [
      headers.join(','),
      values.map(value => `"${value.replace(/"/g, '""')}"`).join(',')
    ].join('\n');
  }

  downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  getConfidenceColor(confidence: number): string {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warn';
    return 'error';
  }

  getConfidenceText(confidence: number): string {
    if (confidence >= 0.9) return 'Excellent';
    if (confidence >= 0.8) return 'Good';
    if (confidence >= 0.6) return 'Fair';
    if (confidence >= 0.4) return 'Poor';
    return 'Very Poor';
  }

  private prepareExportData(data: OcrData): ExportData {
    return {
      bankName: data.bankName.value,
      accountHolderName: data.accountHolderName.value,
      accountNumber: data.accountNumber.value,
      routingNumber: data.routingNumber.value,
      amount: data.amount.value,
      date: data.date.value,
      extractedAt: new Date().toISOString(),
      confidenceScores: {
        bankName: data.bankName.confidence,
        accountHolderName: data.accountHolderName.confidence,
        accountNumber: data.accountNumber.confidence,
        routingNumber: data.routingNumber.confidence,
        amount: data.amount.confidence,
        date: data.date.confidence
      }
    };
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    let errorType = FileUploadError.OCR_PROCESSING_FAILED;

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      const serverError = error.error as OcrErrorResponse;
      if (serverError && serverError.message) {
        errorMessage = serverError.message;
        
        // Map server error types to our enum
        switch (serverError.error) {
          case 'FILE_TOO_LARGE':
            errorType = FileUploadError.FILE_TOO_LARGE;
            break;
          case 'INVALID_FILE_FORMAT':
            errorType = FileUploadError.INVALID_FILE_FORMAT;
            break;
          case 'CORRUPTED_IMAGE':
            errorType = FileUploadError.CORRUPTED_IMAGE;
            break;
          case 'NO_TEXT_DETECTED':
            errorType = FileUploadError.NO_TEXT_DETECTED;
            break;
          default:
            errorType = FileUploadError.OCR_PROCESSING_FAILED;
        }
      } else {
        errorMessage = `Server error: ${error.status} - ${error.statusText}`;
      }
    }

    return throwError(() => ({ message: errorMessage, type: errorType }));
  }
}