import React from 'react';
import {
  Settings,
  Database,
  Moon,
  Sun,
  ShieldCheck,
  FolderOpen,
  Info,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { AppSettings } from '../../lib/storage';

export interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  businessCount: number;
  reviewCount: number;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  businessCount,
  reviewCount,
}) => {
  return (
    <div className="space-y-6">
      {/* View Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-foreground">
            System Settings & Local Configuration
          </h2>
          <Badge variant="indigo" size="sm" className="font-mono">
            MOCK DATA
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Local SQLite storage path, appearance preferences, API connection status, and privacy parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Appearance & Theme</CardTitle>
                <CardDescription>
                  Interface color schemes and typography scaling
                </CardDescription>
              </div>
              {settings.theme === 'dark' ? (
                <Moon className="w-4 h-4 text-indigo-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface-subtle">
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  Color Theme
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Switch between light and dark UI modes
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant={settings.theme === 'light' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => onUpdateSettings({ theme: 'light' })}
                  leftIcon={<Sun className="w-3.5 h-3.5" />}
                >
                  Light
                </Button>
                <Button
                  variant={settings.theme === 'dark' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => onUpdateSettings({ theme: 'dark' })}
                  leftIcon={<Moon className="w-3.5 h-3.5" />}
                >
                  Dark
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface-subtle">
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  Compact Density
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Reduce table row padding for high-density analysis
                </span>
              </div>
              <Button
                variant={settings.compactDensity ? 'primary' : 'outline'}
                size="sm"
                onClick={() =>
                  onUpdateSettings({ compactDensity: !settings.compactDensity })
                }
              >
                {settings.compactDensity ? 'Enabled' : 'Default'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sync & Ingestion Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sync & Export Preferences</CardTitle>
                <CardDescription>
                  Data polling intervals and default download format
                </CardDescription>
              </div>
              <FileSpreadsheet className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Default Export Format
              </label>
              <Select
                value={settings.defaultExportFormat}
                onChange={(e) =>
                  onUpdateSettings({ defaultExportFormat: e.target.value as any })
                }
              >
                <option value="csv">CSV (Universal RFC 4180)</option>
                <option value="xlsx">Excel Spreadsheet XML</option>
                <option value="json">Structured JSON</option>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Auto-Sync Interval
              </label>
              <Select
                value={String(settings.autoSyncMinutes)}
                onChange={(e) =>
                  onUpdateSettings({ autoSyncMinutes: parseInt(e.target.value, 10) })
                }
              >
                <option value="15">Every 15 minutes</option>
                <option value="30">Every 30 minutes</option>
                <option value="60">Every 60 minutes (Recommended)</option>
                <option value="360">Every 6 hours</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Local Storage Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Local-First Storage Engine</CardTitle>
                <CardDescription>
                  Embedded SQLite database and filesystem parameters
                </CardDescription>
              </div>
              <Database className="w-4 h-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg border border-border bg-surface-subtle space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Database Engine:</span>
                <span className="font-semibold text-foreground">SQLite 3 (Local-First)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Location File Path:</span>
                <span className="font-mono text-[11px] text-foreground truncate max-w-[220px]">
                  {settings.dbPath}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Total Indexed Records:</span>
                <span className="font-mono font-semibold text-foreground">
                  {businessCount} Locations, {reviewCount} Reviews
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Schema Version:</span>
                <span className="font-mono text-[11px] text-primary font-semibold">
                  v1.0.0-phase1-relational
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => alert('Local SQLite path: ' + settings.dbPath)}
              leftIcon={<FolderOpen className="w-3.5 h-3.5" />}
            >
              Verify Database Integrity
            </Button>
          </CardContent>
        </Card>

        {/* Security & Compliance Notice */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Compliance & Privacy Guarantee</CardTitle>
                <CardDescription>
                  Enterprise data safety and platform boundary rules
                </CardDescription>
              </div>
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs leading-relaxed text-muted-foreground">
            <p>
              ReviewPilot operates on strict enterprise compliance standards:
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-[11px]">
              <li>
                <strong className="text-foreground">Zero Bot Evasion:</strong> No rotating proxies, no user-agent spoofing, and no CAPTCHA circumvention.
              </li>
              <li>
                <strong className="text-foreground">Authorized Connections:</strong> Integrates only via Google Business Profile APIs and Places API.
              </li>
              <li>
                <strong className="text-foreground">Local-First Privacy:</strong> Your review database is saved locally on your computer with zero external tracking.
              </li>
            </ul>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
              <span>Application Version</span>
              <span className="font-mono font-semibold text-foreground">
                v1.0.0-phase1
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

