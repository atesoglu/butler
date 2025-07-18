import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { ThemeProvider } from '../contexts/ThemeContext';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        {component}
      </MemoryRouter>
    </ThemeProvider>
  );
};

describe('AppLayout', () => {
  it('renders header, navigation, and environment label', () => {
    renderWithProviders(
      <AppLayout breadcrumb={['Textpad']}>Test Content</AppLayout>
    );
    expect(screen.getByText('Butler')).toBeInTheDocument();
    expect(screen.getByText('Textpad')).toBeInTheDocument();
    expect(screen.getByText(/ENV/)).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('shows log panel when notification icon is clicked', () => {
    renderWithProviders(
      <AppLayout breadcrumb={['Settings']}>Test</AppLayout>
    );
    const notificationBtn = screen.getByLabelText('Notifications');
    fireEvent.click(notificationBtn);
    expect(screen.getByText('Application Logs')).toBeInTheDocument();
  });

  it('shows settings panel when settings icon is clicked', () => {
    renderWithProviders(
      <AppLayout breadcrumb={['Home']}>Test</AppLayout>
    );
    const settingsBtn = screen.getByLabelText('Settings');
    fireEvent.click(settingsBtn);
    expect(screen.getByText('Quick Settings')).toBeInTheDocument();
  });
}); 