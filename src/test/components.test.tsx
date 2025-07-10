import { describe, it, expect } from 'vitest';
import { removeEmptyLines, changeCase } from '../utils/textProcessing';

describe('Text Processing Functions', () => {
  it('should remove empty lines', () => {
    const input = 'line1\n\nline2\n  \nline3';
    const expected = 'line1\nline2\nline3';
    expect(removeEmptyLines(input)).toBe(expected);
  });

  it('should change case correctly', () => {
    const input = 'Hello World';
    expect(changeCase(input, 'lowercase')).toBe('hello world');
    expect(changeCase(input, 'uppercase')).toBe('HELLO WORLD');
    expect(changeCase(input, 'titlecase')).toBe('Hello World');
  });
}); 