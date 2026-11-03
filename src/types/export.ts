export type ExportFormat = 'csv' | 'xlsx' | 'json';

export type ExportJobStatus = 'idle' | 'generating' | 'completed' | 'failed';

export interface ExportJob {
  id: string;
  format: ExportFormat;
  targetBusinessName: string;
  rowCount: number;
  fileSizeBytes: number;
  fileName: string;
  createdAt: string;
  status: ExportJobStatus;
  downloadUrl?: string;
  isMock: boolean;
}

export interface ExportConfig {
  format: ExportFormat;
  businessId: string; // 'all' or specific id
  dateRange: 'all' | 'last30days' | 'last90days' | 'lastyear';
  includeOwnerReplies: boolean;
  includeReviewerMetadata: boolean;
  minRating: number;
}

