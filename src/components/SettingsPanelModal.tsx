import React from 'react';
import { ComposedModal, ModalHeader, ModalBody, Button } from '@carbon/react';
import { Sun, Moon } from '@carbon/icons-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { to: '/textpad', label: 'Textpad' },
  { to: '/multi-rename', label: 'Multi-Rename' },
  { to: '/settings', label: 'Settings' }
];

export const SettingsPanelModal: React.FC<SettingsPanelModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { theme, setTheme } = useTheme();
  const envLabel = import.meta.env.VITE_ENV || 'development';

  const handleThemeChange = async (newTheme: 'white' | 'g10' | 'g90' | 'g100') => {
    await setTheme(newTheme);
    onClose();
  };

  const isDarkTheme = theme === 'g90' || theme === 'g100';

  return (
    <ComposedModal open={isOpen} onClose={onClose} size="md">
      <ModalHeader 
        title="Quick Settings" 
        label="Access frequently used settings" 
        buttonOnClick={onClose} 
      />
      <ModalBody>
        <div style={{ padding: 16 }}>
          <h3>Theme</h3>
          <div style={{ marginBottom: 16 }}>
            <Button 
              kind={!isDarkTheme ? 'primary' : 'secondary'} 
              renderIcon={() => <Sun />} 
              onClick={() => handleThemeChange('g10')}
              style={{ marginRight: 8 }}
            >
              Light
            </Button>
            <Button 
              kind={isDarkTheme ? 'primary' : 'secondary'} 
              renderIcon={() => <Moon />} 
              onClick={() => handleThemeChange('g100')}
            >
              Dark
            </Button>
          </div>
          <h3>Environment</h3>
          <p>Current: {envLabel.toUpperCase()}</p>
          <h3>Navigation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {navLinks.map(link => (
              <Button 
                key={link.to} 
                kind="ghost" 
                as={Link} 
                to={link.to} 
                onClick={onClose}
              >
                {link.label}
              </Button>
            ))}
          </div>
        </div>
      </ModalBody>
    </ComposedModal>
  );
}; 