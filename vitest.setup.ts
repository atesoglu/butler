import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia for Carbon components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Electron API
Object.defineProperty(window, 'electronAPI', {
  writable: true,
  value: {
    invoke: vi.fn().mockResolvedValue({}),
  },
});

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  writable: true,
  value: {
    VITE_ENV: 'test',
  },
}); 