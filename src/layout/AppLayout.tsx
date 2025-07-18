import React, { useState } from 'react';
import { Theme } from '@carbon/react';
import { useTheme } from '../contexts/ThemeContext';
import { AppHeader } from '../components/AppHeader';
import { AppSideNav } from '../components/AppSideNav';
import { AppBreadcrumb } from '../components/AppBreadcrumb';
import { LogSidePanel } from '../components/LogSidePanel';
import { SettingsPanelModal } from '../components/SettingsPanelModal';

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumb?: string[];
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, breadcrumb = [] }) => {
  const { theme } = useTheme();
  const [isLogPanelOpen, setLogPanelOpen] = useState(false);
  const [isSettingsPanelOpen, setSettingsPanelOpen] = useState(false);

  const handleOpenLogPanel = () => setLogPanelOpen(true);
  const handleCloseLogPanel = () => setLogPanelOpen(false);
  const handleOpenSettingsPanel = () => setSettingsPanelOpen(true);
  const handleCloseSettingsPanel = () => setSettingsPanelOpen(false);

  return (
    <Theme theme={theme}>
      <AppHeader 
        onOpenLogPanel={handleOpenLogPanel}
        onOpenSettingsPanel={handleOpenSettingsPanel}
      />
      <AppSideNav />
      <AppBreadcrumb breadcrumb={breadcrumb} />
      <div className="content">
        {children}
      </div>
      
      <LogSidePanel 
        isOpen={isLogPanelOpen} 
        onClose={handleCloseLogPanel} 
      />
      <SettingsPanelModal 
        isOpen={isSettingsPanelOpen} 
        onClose={handleCloseSettingsPanel} 
      />
      
      <div style={{ 
        position: 'fixed', 
        right: 16, 
        bottom: 8, 
        zIndex: 9999, 
        fontSize: 12, 
        color: '#888' 
      }}>
        {(import.meta.env.VITE_ENV || 'development').toUpperCase()} ENV
      </div>
    </Theme>
  );
}; 