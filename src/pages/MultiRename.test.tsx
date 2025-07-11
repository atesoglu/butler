import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import MultiRename from './MultiRename';

describe('MultiRename', () => {
  it('renders file uploader, file list, and preview textarea', () => {
    render(<MultiRename />);
    expect(screen.getByText('File Drop Zone')).toBeInTheDocument();
    expect(screen.getByText('file1.txt')).toBeInTheDocument();
    expect(screen.getByLabelText('Preview')).toBeInTheDocument();
  });
}); 