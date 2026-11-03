import { Review } from '../types/review';
import { ExportFormat } from '../types/export';
import { sanitizeFilename } from './utils';

export function escapeCSVField(field: unknown): string {
  if (field === null || field === undefined) {
    return '""';
  }
  const str = String(field);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

export function generateCSV(reviews: Review[]): string {
  const headers = [
    'Review ID',
    'Business ID',
    'Business Name',
    'Reviewer Name',
    'Local Guide',
    'Reviewer Total Reviews',
    'Rating (Stars)',
    'Sentiment',
    'Review Text',
    'Published Date',
    'Likes Count',
    'Owner Response',
    'Response Date',
    'Tags',
  ];

  const rows = reviews.map((rev) => [
    escapeCSVField(rev.id),
    escapeCSVField(rev.businessId),
    escapeCSVField(rev.businessName),
    escapeCSVField(rev.reviewer.displayName),
    escapeCSVField(rev.reviewer.isLocalGuide ? 'Yes' : 'No'),
    escapeCSVField(rev.reviewer.totalReviewsCount ?? 0),
    escapeCSVField(rev.rating),
    escapeCSVField(rev.sentiment),
    escapeCSVField(rev.text),
    escapeCSVField(rev.publishedAt),
    escapeCSVField(rev.likesCount),
    escapeCSVField(rev.ownerResponse?.responseText ?? ''),
    escapeCSVField(rev.ownerResponse?.respondedAt ?? ''),
    escapeCSVField((rev.tags ?? []).join('; ')),
  ]);

  // UTF-8 BOM (\uFEFF) ensures Excel opens special characters correctly
  return '\uFEFF' + [headers.map(escapeCSVField).join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

export function generateJSON(reviews: Review[]): string {
  return JSON.stringify(reviews, null, 2);
}

export function generateExcelXML(reviews: Review[]): string {
  // Generates Microsoft Excel XML Spreadsheet format (compatible with Excel 2003+ and modern Office)
  const rowsXml = reviews
    .map(
      (r) => `
      <Row>
        <Cell><Data ss:Type="String">${escapeXml(r.id)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(r.businessName)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(r.reviewer.displayName)}</Data></Cell>
        <Cell><Data ss:Type="Number">${r.rating}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(r.sentiment)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(r.text)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(r.publishedAt)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(r.ownerResponse?.responseText ?? '')}</Data></Cell>
      </Row>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Reviews">
    <Table>
      <Row>
        <Cell><Data ss:Type="String">Review ID</Data></Cell>
        <Cell><Data ss:Type="String">Business Name</Data></Cell>
        <Cell><Data ss:Type="String">Reviewer Name</Data></Cell>
        <Cell><Data ss:Type="String">Rating</Data></Cell>
        <Cell><Data ss:Type="String">Sentiment</Data></Cell>
        <Cell><Data ss:Type="String">Review Text</Data></Cell>
        <Cell><Data ss:Type="String">Published Date</Data></Cell>
        <Cell><Data ss:Type="String">Owner Response</Data></Cell>
      </Row>
      ${rowsXml}
    </Table>
  </Worksheet>
</Workbook>`;
}

function escapeXml(unsafe: string | null | undefined): string {
  if (unsafe === null || unsafe === undefined) return '';
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = sanitizeFilename(filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function executeClientExport(
  reviews: Review[],
  format: ExportFormat,
  businessPrefix: string = 'reviewpilot'
): { fileName: string; byteCount: number } {
  const dateStr = new Date().toISOString().split('T')[0];
  const baseName = `${businessPrefix}_reviews_${dateStr}`;

  let content = '';
  let mimeType = 'text/plain';
  let extension = 'txt';

  switch (format) {
    case 'csv':
      content = generateCSV(reviews);
      mimeType = 'text/csv;charset=utf-8;';
      extension = 'csv';
      break;
    case 'json':
      content = generateJSON(reviews);
      mimeType = 'application/json;charset=utf-8;';
      extension = 'json';
      break;
    case 'xlsx':
      content = generateExcelXML(reviews);
      mimeType = 'application/vnd.ms-excel;charset=utf-8;';
      extension = 'xlsx';
      break;
  }

  const fileName = `${baseName}.${extension}`;
  downloadFile(content, fileName, mimeType);

  return {
    fileName,
    byteCount: new Blob([content]).size,
  };
}

