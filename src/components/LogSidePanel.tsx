import React from 'react';
import { Button } from '@carbon/react';
import { Close } from '@carbon/icons-react';
import { LogPanel } from './LogPanel';
import '../styles/log-side-panel.scss';

interface LogSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogSidePanel: React.FC<LogSidePanelProps> = ({ isOpen, onClose }) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="log-side-panel-overlay"
          data-testid="log-side-panel-overlay"
          onClick={handleOverlayClick}
        />
      )}
      
      {/* Side Panel */}
      <div 
        className={`log-side-panel ${isOpen ? 'log-side-panel--open' : ''}`}
        role="complementary"
        aria-label="Application logs panel"
      >
        <div className="log-side-panel__header">
          <h3 className="log-side-panel__title">Application Logs</h3>
          <Button
            kind="ghost"
            size="sm"
            renderIcon={Close}
            iconDescription="Close logs panel"
            onClick={onClose}
            className="log-side-panel__close-btn"
          />
        </div>
        
        <div className="log-side-panel__content">
          <LogPanel isPanelOpen={isOpen} />
        </div>
      </div>
    </>
  );
}; 