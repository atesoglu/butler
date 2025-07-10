import { describe, it, expect } from 'vitest';
import {
  removeEmptyLines,
  removeDuplicateLines,
  removeLinesContaining,
  addPrefix,
  addSuffix,
  sortLines,
  changeCase,
  addLineBreaks,
  removeExtraLineBreaks,
  processTextWithOptions,
} from '../utils/textProcessing';

describe('Text Processing Utils', () => {
  describe('removeEmptyLines', () => {
    it('should remove empty lines from text', () => {
      const input = 'line1\n\nline2\n  \nline3';
      const expected = 'line1\nline2\nline3';
      expect(removeEmptyLines(input)).toBe(expected);
    });

    it('should return empty string for all empty lines', () => {
      const input = '\n\n  \n\t\n';
      expect(removeEmptyLines(input)).toBe('');
    });

    it('should return original text if no empty lines', () => {
      const input = 'line1\nline2\nline3';
      expect(removeEmptyLines(input)).toBe(input);
    });
  });

  describe('removeDuplicateLines', () => {
    it('should remove duplicate lines', () => {
      const input = 'line1\nline2\nline1\nline3\nline2';
      const expected = 'line1\nline2\nline3';
      expect(removeDuplicateLines(input)).toBe(expected);
    });

    it('should preserve order of first occurrence', () => {
      const input = 'line2\nline1\nline2\nline3';
      const expected = 'line2\nline1\nline3';
      expect(removeDuplicateLines(input)).toBe(expected);
    });
  });

  describe('removeLinesContaining', () => {
    it('should remove lines containing specified text', () => {
      const input = 'apple\nbanana\napple pie\ncherry';
      const expected = 'banana\ncherry';
      expect(removeLinesContaining(input, 'apple')).toBe(expected);
    });

    it('should return original text if search text is empty', () => {
      const input = 'line1\nline2\nline3';
      expect(removeLinesContaining(input, '')).toBe(input);
    });

    it('should be case sensitive', () => {
      const input = 'Apple\napple\nBANANA';
      const expected = 'apple\nBANANA';
      expect(removeLinesContaining(input, 'Apple')).toBe(expected);
    });
  });

  describe('addPrefix', () => {
    it('should add prefix to all lines', () => {
      const input = 'line1\nline2\nline3';
      const expected = 'prefix_line1\nprefix_line2\nprefix_line3';
      expect(addPrefix(input, 'prefix_')).toBe(expected);
    });

    it('should return original text if prefix is empty', () => {
      const input = 'line1\nline2\nline3';
      expect(addPrefix(input, '')).toBe(input);
    });
  });

  describe('addSuffix', () => {
    it('should add suffix before file extension', () => {
      const input = 'file1.txt\nfile2.doc\nfile3';
      const expected = 'file1_suffix.txt\nfile2_suffix.doc\nfile3_suffix';
      expect(addSuffix(input, '_suffix')).toBe(expected);
    });

    it('should return original text if suffix is empty', () => {
      const input = 'line1\nline2\nline3';
      expect(addSuffix(input, '')).toBe(input);
    });
  });

  describe('sortLines', () => {
    it('should sort lines alphabetically', () => {
      const input = 'zebra\napple\nbanana';
      const expected = 'apple\nbanana\nzebra';
      expect(sortLines(input)).toBe(expected);
    });

    it('should handle empty text', () => {
      expect(sortLines('')).toBe('');
    });
  });

  describe('changeCase', () => {
    it('should convert to lowercase', () => {
      const input = 'Hello World';
      expect(changeCase(input, 'lowercase')).toBe('hello world');
    });

    it('should convert to uppercase', () => {
      const input = 'Hello World';
      expect(changeCase(input, 'uppercase')).toBe('HELLO WORLD');
    });

    it('should convert to title case', () => {
      const input = 'hello world test';
      expect(changeCase(input, 'titlecase')).toBe('Hello World Test');
    });
  });

  describe('addLineBreaks', () => {
    it('should add extra line breaks', () => {
      const input = 'line1\nline2\nline3';
      const expected = 'line1\n\nline2\n\nline3';
      expect(addLineBreaks(input)).toBe(expected);
    });
  });

  describe('removeExtraLineBreaks', () => {
    it('should remove extra line breaks', () => {
      const input = 'line1\n\n\nline2\n\nline3';
      const expected = 'line1\nline2\nline3';
      expect(removeExtraLineBreaks(input)).toBe(expected);
    });
  });

  describe('processTextWithOptions', () => {
    it('should apply multiple transformations', () => {
      const input = 'Hello World\ntest file.txt';
      const options = {
        prefix: 'prefix_',
        suffix: '_suffix',
        removeText: '',
        caseType: 'uppercase' as const,
        startNumber: 1,
        renamePattern: '{n}_',
      };

      const expected = '1_\n2_';
      expect(processTextWithOptions(input, options)).toBe(expected);
    });

    it('should apply numbering pattern', () => {
      const input = 'file1\nfile2\nfile3';
      const options = {
        prefix: '',
        suffix: '',
        removeText: '',
        caseType: 'lowercase' as const,
        startNumber: 5,
        renamePattern: 'file_{n}',
      };

      const expected = 'file_5\nfile_6\nfile_7';
      expect(processTextWithOptions(input, options)).toBe(expected);
    });
  });
}); 