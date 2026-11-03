import { describe, it, expect } from 'vitest';
import {
  cn,
  formatDate,
  formatNumber,
  formatPercentage,
  formatFileSize,
  sanitizeFilename,
} from '../../src/lib/utils';

describe('Utility Functions', () => {
  describe('cn (Classnames Merge)', () => {
    it('merges class names correctly', () => {
      expect(cn('px-2', 'py-1', 'bg-red-500')).toBe('px-2 py-1 bg-red-500');
    });

    it('resolves tailwind conflicts', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2');
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });
  });

  describe('formatDate', () => {
    it('formats ISO date string into readable US date', () => {
      const formatted = formatDate('2026-11-03T09:00:00Z');
      expect(formatted).toMatch(/Nov\s+3,\s+2026/);
    });

    it('gracefully handles invalid date string', () => {
      expect(formatDate('invalid-date')).toBe('Invalid Date');
    });
  });

  describe('formatNumber', () => {
    it('formats numbers with thousands separators', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(2884)).toBe('2,884');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });
  });

  describe('formatPercentage', () => {
    it('formats percentage with 1 decimal place', () => {
      expect(formatPercentage(92.45)).toBe('92.5%');
      expect(formatPercentage(100)).toBe('100.0%');
      expect(formatPercentage(3.6)).toBe('3.6%');
    });
  });

  describe('formatFileSize', () => {
    it('formats bytes, kilobytes, and megabytes', () => {
      expect(formatFileSize(500)).toBe('500 B');
      expect(formatFileSize(1024)).toBe('1.0 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
      expect(formatFileSize(724810)).toBe('707.8 KB');
    });
  });

  describe('sanitizeFilename', () => {
    it('removes illegal characters and spaces', () => {
      expect(sanitizeFilename('my test:file?.csv')).toBe('my_test_file_.csv');
      expect(sanitizeFilename('review/export\\2026.json')).toBe('review_export_2026.json');
      expect(sanitizeFilename('REPORT <FINAL> *NEW*')).toBe('report__final___new_');
    });
  });
});

