import React, { useState } from 'react';
import { 
  Header, 
  HeaderName, 
  HeaderNavigation, 
  HeaderMenuItem, 
  HeaderGlobalBar, 
  HeaderGlobalAction,
  ComposedModal,
  ModalHeader,
  ModalBody,
  Button
} from '@carbon/react';
import { Notification, UserAvatar, Help, Sun, Moon } from '@carbon/icons-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import butlerLogo from '../assets/butler.svg';

interface AppHeaderProps {
  onOpenLogPanel: () => void;
  onOpenSettingsPanel: () => void;
}

const navLinks = [
  { to: '/textpad', label: 'Textpad' },
  { to: '/multi-rename', label: 'Multi-Rename' },
  { to: '/settings', label: 'Settings' }
];

const themes = [
  { id: 'white', label: 'White Theme', icon: Sun },
  { id: 'g10', label: 'Light Gray Theme', icon: Sun },
  { id: 'g90', label: 'Dark Gray Theme', icon: Moon },
  { id: 'g100', label: 'Dark Theme', icon: Moon }
];

export const AppHeader: React.FC<AppHeaderProps> = ({ 
  onOpenLogPanel, 
  onOpenSettingsPanel 
}) => {
  const { theme, setTheme } = useTheme();
  const [themeModal, setThemeModal] = useState(false);
  const location = useLocation();

  const handleThemeChange = async (newTheme: 'white' | 'g10' | 'g90' | 'g100') => {
    await setTheme(newTheme);
    setThemeModal(false);
  };

  const isDarkTheme = theme === 'g90' || theme === 'g100';

  return (
    <>
      <Header aria-label="Butler App">
        <HeaderName prefix="">
          <img 
            src={butlerLogo} 
            alt="Butler Logo" 
            style={{ height: 32, marginRight: 8, verticalAlign: 'middle' }} 
          />
          Butler
        </HeaderName>
        <HeaderNavigation aria-label="Butler Navigation">
          {navLinks.map(link => (
            <HeaderMenuItem key={link.to} as={Link} to={link.to}>
              {link.label}
            </HeaderMenuItem>
          ))}
        </HeaderNavigation>
        <HeaderGlobalBar>
          <HeaderGlobalAction 
            aria-label="Theme" 
            onClick={() => setThemeModal(true)}
          >
            {isDarkTheme ? <Sun /> : <Moon />}
          </HeaderGlobalAction>
          <HeaderGlobalAction aria-label="Help">
            <Help />
          </HeaderGlobalAction>
          <HeaderGlobalAction 
            aria-label="Settings" 
            onClick={onOpenSettingsPanel}
          >
            <UserAvatar />
          </HeaderGlobalAction>
          <HeaderGlobalAction 
            aria-label="Notifications" 
            onClick={onOpenLogPanel}
          >
            <Notification />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>

      <ComposedModal 
        open={themeModal} 
        onClose={() => setThemeModal(false)} 
        size="xs"
      >
        <ModalHeader 
          title="Switch Theme" 
          label="" 
          buttonOnClick={() => setThemeModal(false)} 
        />
        <ModalBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {themes.map(t => {
              const IconComponent = t.icon;
              return (
                <Button 
                  key={t.id} 
                  kind={theme === t.id ? 'primary' : 'secondary'} 
                  renderIcon={() => <IconComponent />} 
                  onClick={() => handleThemeChange(t.id as 'white' | 'g10' | 'g90' | 'g100')}
                >
                  {t.label}
                </Button>
              );
            })}
          </div>
        </ModalBody>
      </ComposedModal>
    </>
  );
}; 