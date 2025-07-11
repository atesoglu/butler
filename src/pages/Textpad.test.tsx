import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import Textpad from './Textpad';

describe('Textpad', () => {
  it('renders form sections and textarea', () => {
    render(<Textpad />);
    expect(screen.getByText('Remove Lines')).toBeInTheDocument();
    expect(screen.getByText('Prefix / Suffix')).toBeInTheDocument();
    expect(screen.getByLabelText('Textpad')).toBeInTheDocument();
  });
}); 