import React, { useEffect, useState } from 'react';
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  Content,
  Breadcrumb,
  BreadcrumbItem,
  ComposedModal,
  ModalHeader,
  ModalBody
} from '@carbon/react';
import { Notification } from '@carbon/icons-react';
import butlerLogo from '../assets/butler.svg';
import './AppLayout.scss';
import { Link } from 'react-router-dom';

const navLinks = [
  { to: '/textpad', label: 'Textpad' },
  { to: '/multi-rename', label: 'Multi-Rename' },
  { to: '/settings', label: 'Settings' },
];

export const AppLayout: React.FC<{ children: React.ReactNode, breadcrumb?: string[] }> = ({ children, breadcrumb = [] }) => {
  const [isPanelOpen, setPanelOpen] = useState(false);
  const [logs, setLogs] = useState<{timestamp: string, message: string}[]>([]);
  const envLabel = import.meta.env.VITE_ENV || 'development';

  useEffect(() => {
    if (isPanelOpen && window.electronAPI) {
      window.electronAPI.invoke('get-logs').then(setLogs);
    }
  }, [isPanelOpen]);

  return (
    <>
      <Header aria-label="Butler App">
        <HeaderName prefix="">
          <img src={butlerLogo} alt="Butler Logo" style={{ height: 32, marginRight: 8, verticalAlign: 'middle' }} />
          Butler
        </HeaderName>
        <HeaderNavigation aria-label="Butler Navigation">
          {navLinks.map(link => (
            <HeaderMenuItem key={link.to} as={Link} to={link.to}>{link.label}</HeaderMenuItem>
          ))}
        </HeaderNavigation>
        <HeaderGlobalBar>
          <HeaderGlobalAction aria-label="Notifications" onClick={() => setPanelOpen(true)}>
            <Notification />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>
      <div className="breadcrumb-container">
        <Breadcrumb>
          <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
          {breadcrumb.map((item, idx) => (
            <BreadcrumbItem key={idx}>{item}</BreadcrumbItem>
          ))}
        </Breadcrumb>
      </div>
      <Content>
        {children}
      </Content>
      <ComposedModal open={isPanelOpen} onClose={() => setPanelOpen(false)} size="lg" containerClassName="log-modal">
        <ModalHeader title="Logs" label="" buttonOnClick={() => setPanelOpen(false)} />
        <ModalBody>
          <div style={{ padding: 16, maxHeight: 400, overflowY: 'auto', fontFamily: 'monospace', fontSize: 13 }}>
            {logs.length === 0 ? (
              <div>No logs yet.</div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} style={{ marginBottom: 8 }}>
                  <span style={{ color: '#888' }}>{log.timestamp}</span> — {log.message}
                </div>
              ))
            )}
          </div>
        </ModalBody>
      </ComposedModal>
      <div style={{ position: 'fixed', right: 16, bottom: 8, zIndex: 9999, fontSize: 12, color: '#888' }}>
        {envLabel.toUpperCase()} ENV
      </div>
    </>
  );
}; 