import React, { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileCode,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { ExportFormat, ExportJob } from '../../types/export';
import { Review } from '../../types/review';
import { BusinessLocation } from '../../types/business';
import { executeClientExport } from '../../lib/exportEngine';
import { formatNumber, formatFileSize, formatDate } from '../../lib/utils';

export interface ExportsViewProps {
  reviews: Review[];
  businesses: BusinessLocation[];
  exportHistory: ExportJob[];
  onAddExportJob: (job: ExportJob) => void;
}

export const ExportsView: React.FC<ExportsViewProps> = ({
  reviews,
  businesses,
  exportHistory,
  onAddExportJob,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('all');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [lastExportedFile, setLastExportedFile] = useState<string | null>(null);

  const handleTriggerExport = () => {
    setIsExporting(true);

    const targetReviews =
      selectedBusinessId === 'all'
        ? reviews
        : reviews.filter((r) => r.businessId === selectedBusinessId);

    const targetBusinessName =
      selectedBusinessId === 'all'
        ? 'All Businesses (Unified)'
        : businesses.find((b) => b.id === selectedBusinessId)?.name || 'Custom';

    // Simulate short background processing for realistic SaaS feel
    setTimeout(() => {
      const result = executeClientExport(
        targetReviews,
        selectedFormat,
        selectedBusinessId === 'all' ? 'reviewpilot_unified' : 'reviewpilot_location'
      );

      const newJob: ExportJob = {
        id: `exp_${Date.now()}`,
        format: selectedFormat,
        targetBusinessName,
        rowCount: targetReviews.length,
        fileSizeBytes: result.byteCount,
        fileName: result.fileName,
        createdAt: new Date().toISOString(),
        status: 'completed',
        isMock: true,
      };

      onAddExportJob(newJob);
      setLastExportedFile(result.fileName);
      setIsExporting(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-foreground">
            Data Export Engine
          </h2>
          <Badge variant="indigo" size="sm" className="font-mono">
            MOCK DATA
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Generate RFC 4180 compliant CSV, Excel Spreadsheet XML, and structured JSON files for CRM or analytical pipelines.
        </p>
      </div>

      {/* Main Export Configuration Box */}
      <Card>
        <CardHeader>
          <CardTitle>Configure Export Dataset</CardTitle>
          <CardDescription>
            Select file structure, target locations, and output specifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Format Selection Cards */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-3 block">
              1. Select File Format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* CSV */}
              <div
                onClick={() => setSelectedFormat('csv')}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedFormat === 'csv'
                    ? 'border-primary bg-primary/5 shadow-subtle'
                    : 'border-border bg-card hover:bg-surface-highlight'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-foreground">CSV (RFC 4180)</span>
                  </div>
                  {selectedFormat === 'csv' && (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Universal spreadsheet standard with UTF-8 BOM encoding for Excel compatibility.
                </p>
              </div>

              {/* XLSX */}
              <div
                onClick={() => setSelectedFormat('xlsx')}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedFormat === 'xlsx'
                    ? 'border-primary bg-primary/5 shadow-subtle'
                    : 'border-border bg-card hover:bg-surface-highlight'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-foreground">Excel Spreadsheet</span>
                  </div>
                  {selectedFormat === 'xlsx' && (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Native XML spreadsheet schema ready for Microsoft Excel, Google Sheets, or Numbers.
                </p>
              </div>

              {/* JSON */}
              <div
                onClick={() => setSelectedFormat('json')}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedFormat === 'json'
                    ? 'border-primary bg-primary/5 shadow-subtle'
                    : 'border-border bg-card hover:bg-surface-highlight'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-bold text-foreground">Structured JSON</span>
                  </div>
                  {selectedFormat === 'json' && (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Clean indented nested objects preserving review attributes, author metadata, and replies.
                </p>
              </div>
            </div>
          </div>

          {/* Scope selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                2. Target Business Scope
              </label>
              <Select
                value={selectedBusinessId}
                onChange={(e) => setSelectedBusinessId(e.target.value)}
              >
                <option value="all">All Managed Businesses ({reviews.length} reviews)</option>
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                3. Date Horizon
              </label>
              <Select defaultValue="all">
                <option value="all">All-Time Historical Reviews</option>
                <option value="30d">Past 30 Days</option>
                <option value="90d">Past 90 Days</option>
                <option value="1y">Past 12 Months</option>
              </Select>
            </div>
          </div>

          {/* Trigger Button & Status Notice */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/60">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Exports generate client-side with zero external cloud upload.</span>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={handleTriggerExport}
              isLoading={isExporting}
              leftIcon={<Download className="w-4 h-4" />}
            >
              {isExporting ? 'Generating Dataset...' : 'Generate & Download Export'}
            </Button>
          </div>

          {lastExportedFile && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Successfully generated <strong className="font-mono">{lastExportedFile}</strong>
                </span>
              </div>
              <span className="text-[10px] uppercase font-mono">Downloaded</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export History Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Export Activity & Download History</CardTitle>
              <CardDescription>
                Audit log of recent export jobs generated in this session
              </CardDescription>
            </div>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle border-b border-border/80 text-muted-foreground uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Format</th>
                  <th className="py-2.5 px-4 font-semibold">Scope</th>
                  <th className="py-2.5 px-4 font-semibold">Rows</th>
                  <th className="py-2.5 px-4 font-semibold">File Size</th>
                  <th className="py-2.5 px-4 font-semibold">Generated</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-foreground">
                {exportHistory.map((job) => (
                  <tr key={job.id} className="hover:bg-surface-highlight/40 transition-colors">
                    <td className="py-3 px-4">
                      <Badge variant="secondary" size="sm" className="font-mono uppercase font-bold">
                        {job.format}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      {job.targetBusinessName}
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">
                      {formatNumber(job.rowCount)}
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">
                      {formatFileSize(job.fileSizeBytes)}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                      {formatDate(job.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant="success" size="sm">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

