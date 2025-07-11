import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

describe('AppLayout', () => {
  it('renders header, navigation, and environment label', () => {
    render(
      <MemoryRouter>
        <AppLayout breadcrumb={['Textpad']}>Test Content</AppLayout>
      </MemoryRouter>
    );
    expect(screen.getByText('Butler')).toBeInTheDocument();
    expect(screen.getByText('Textpad')).toBeInTheDocument();
    expect(screen.getByText(/ENV/)).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('shows log panel when notification icon is clicked', () => {
    render(
      <MemoryRouter>
        <AppLayout breadcrumb={['Settings']}>Test</AppLayout>
      </MemoryRouter>
    );
    const notificationBtn = screen.getByLabelText('Notifications');
    fireEvent.click(notificationBtn);
    expect(screen.getByText('Logs')).toBeInTheDocument();
  });
}); 