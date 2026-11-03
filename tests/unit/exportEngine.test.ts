import { describe, it, expect } from 'vitest';
import {
  escapeCSVField,
  generateCSV,
  generateJSON,
  generateExcelXML,
} from '../../src/lib/exportEngine';
import { MOCK_REVIEWS } from '../../src/mock/mockData';

describe('Export Engine', () => {
  describe('escapeCSVField', () => {
    it('wraps fields with commas in double quotes', () => {
      expect(escapeCSVField('Seattle, WA')).toBe('"Seattle, WA"');
    });

    it('escapes internal double quotes by doubling them per RFC 4180', () => {
      expect(escapeCSVField('He said "Great food"')).toBe('"He said ""Great food"""');
    });

    it('wraps fields with newlines in double quotes', () => {
      expect(escapeCSVField('Line 1\nLine 2')).toBe('"Line 1\nLine 2"');
    });

    it('leaves plain strings without quotes', () => {
      expect(escapeCSVField('NormalString')).toBe('"NormalString"');
    });

    it('handles null and undefined gracefully', () => {
      expect(escapeCSVField(null)).toBe('""');
      expect(escapeCSVField(undefined)).toBe('""');
    });
  });

  describe('generateCSV', () => {
    it('begins with UTF-8 BOM marker for Excel compatibility', () => {
      const csv = generateCSV(MOCK_REVIEWS);
      expect(csv.startsWith('\uFEFF')).toBe(true);
    });

    it('contains mandatory review header fields', () => {
      const csv = generateCSV(MOCK_REVIEWS);
      expect(csv).toContain('"Review ID"');
      expect(csv).toContain('"Business Name"');
      expect(csv).toContain('"Reviewer Name"');
      expect(csv).toContain('"Rating (Stars)"');
      expect(csv).toContain('"Sentiment"');
      expect(csv).toContain('"Review Text"');
      expect(csv).toContain('"Owner Response"');
    });

    it('generates the exact count of data rows matching reviews', () => {
      const csv = generateCSV(MOCK_REVIEWS);
      // Remove BOM and split by CRLF
      const cleanCsv = csv.replace('\uFEFF', '');
      const lines = cleanCsv.split('\r\n').filter((l) => l.trim().length > 0);
      // 1 header row + N review rows
      expect(lines.length).toBe(MOCK_REVIEWS.length + 1);
    });
  });

  describe('generateJSON', () => {
    it('produces valid parseable JSON array of review objects', () => {
      const jsonStr = generateJSON(MOCK_REVIEWS);
      const parsed = JSON.parse(jsonStr);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(MOCK_REVIEWS.length);
      expect(parsed[0].id).toBe(MOCK_REVIEWS[0].id);
      expect(parsed[0].businessName).toBe(MOCK_REVIEWS[0].businessName);
    });
  });

  describe('generateExcelXML', () => {
    it('produces valid Excel XML Spreadsheet 2003 schema', () => {
      const xml = generateExcelXML(MOCK_REVIEWS);
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"');
      expect(xml).toContain('<Worksheet ss:Name="Reviews">');
      expect(xml).toContain('<Table>');
    });

    it('escapes XML special characters (&, <, >, ", \') safely', () => {
      const sampleReviews = [
        {
          ...MOCK_REVIEWS[0],
          text: 'Quality & Service <Excellent> "Always"',
        },
      ];
      const xml = generateExcelXML(sampleReviews);
      expect(xml).toContain('Quality &amp; Service &lt;Excellent&gt; &quot;Always&quot;');
    });
  });
});

