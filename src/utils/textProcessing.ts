import { TextProcessingOptions } from '../types';

export const removeEmptyLines = (text: string): string => {
  const lines = text.split('\n');
  const filteredLines = lines.filter(line => line.trim() !== '');
  return filteredLines.join('\n');
};

export const removeDuplicateLines = (text: string): string => {
  const lines = text.split('\n');
  const uniqueLines = [...new Set(lines)];
  return uniqueLines.join('\n');
};

export const removeLinesContaining = (text: string, searchText: string): string => {
  if (!searchText) return text;
  const lines = text.split('\n');
  const filteredLines = lines.filter(line => !line.includes(searchText));
  return filteredLines.join('\n');
};

export const addPrefix = (text: string, prefix: string): string => {
  if (!prefix) return text;
  const lines = text.split('\n');
  const prefixedLines = lines.map(line => prefix + line);
  return prefixedLines.join('\n');
};

export const addSuffix = (text: string, suffix: string): string => {
  if (!suffix) return text;
  const lines = text.split('\n');
  const suffixedLines = lines.map(line => {
    const lastDotIndex = line.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      return line.substring(0, lastDotIndex) + suffix + line.substring(lastDotIndex);
    }
    return line + suffix;
  });
  return suffixedLines.join('\n');
};

export const sortLines = (text: string): string => {
  const lines = text.split('\n');
  const sortedLines = lines.sort();
  return sortedLines.join('\n');
};

export const changeCase = (text: string, caseType: 'lowercase' | 'uppercase' | 'titlecase'): string => {
  switch (caseType) {
    case 'lowercase':
      return text.toLowerCase();
    case 'uppercase':
      return text.toUpperCase();
    case 'titlecase':
      return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    default:
      return text;
  }
};

export const addLineBreaks = (text: string): string => {
  return text.replace(/\n/g, '\n\n');
};

export const removeExtraLineBreaks = (text: string): string => {
  return text.replace(/\n+/g, '\n');
};

export const processTextWithOptions = (text: string, options: TextProcessingOptions): string => {
  let processedText = text;

  // Apply case changes
  processedText = changeCase(processedText, options.caseType);

  // Apply prefix
  if (options.prefix) {
    processedText = addPrefix(processedText, options.prefix);
  }

  // Apply suffix
  if (options.suffix) {
    processedText = addSuffix(processedText, options.suffix);
  }

  // Apply numbering pattern - only if it contains {n} and we want to replace the entire line
  if (options.renamePattern && options.renamePattern.includes('{n}')) {
    const lines = processedText.split('\n');
    const numberedLines = lines.map((line, index) => 
      options.renamePattern.replace('{n}', (options.startNumber + index).toString())
    );
    processedText = numberedLines.join('\n');
  }

  return processedText;
}; 