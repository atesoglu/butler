import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LogSidePanel } from './LogSidePanel';

// Mock the LogPanel component
vi.mock('./LogPanel', () => ({
  LogPanel: ({ isPanelOpen }: { isPanelOpen: boolean }) => (
    <div data-testid="log-panel" data-open={isPanelOpen}>
      Mocked LogPanel
    </div>
  ),
}));

describe('LogSidePanel', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders when closed', () => {
    render(<LogSidePanel isOpen={false} onClose={mockOnClose} />);
    
    const panel = screen.getByRole('complementary');
    expect(panel).toBeInTheDocument();
    expect(panel).not.toHaveClass('log-side-panel--open');
  });

  it('renders when open', () => {
    render(<LogSidePanel isOpen={true} onClose={mockOnClose} />);
    
    const panel = screen.getByRole('complementary');
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveClass('log-side-panel--open');
  });

  it('shows overlay when open', () => {
    render(<LogSidePanel isOpen={true} onClose={mockOnClose} />);
    
    const overlay = screen.getByTestId('log-side-panel-overlay');
    expect(overlay).toBeInTheDocument();
  });

  it('does not show overlay when closed', () => {
    render(<LogSidePanel isOpen={false} onClose={mockOnClose} />);
    
    const overlay = screen.queryByTestId('log-side-panel-overlay');
    expect(overlay).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<LogSidePanel isOpen={true} onClose={mockOnClose} />);
    
    const closeButton = screen.getByLabelText('Close logs panel');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    render(<LogSidePanel isOpen={true} onClose={mockOnClose} />);
    
    const overlay = screen.getByTestId('log-side-panel-overlay');
    fireEvent.click(overlay);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders LogPanel with correct props', () => {
    render(<LogSidePanel isOpen={true} onClose={mockOnClose} />);
    
    const logPanel = screen.getByTestId('log-panel');
    expect(logPanel).toBeInTheDocument();
    expect(logPanel).toHaveAttribute('data-open', 'true');
  });

  it('displays correct title', () => {
    render(<LogSidePanel isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('Application Logs')).toBeInTheDocument();
  });
}); 