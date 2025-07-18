import React from 'react';
import { SideNav, SideNavItems, SideNavLink, SideNavDivider } from '@carbon/react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/textpad', label: 'Textpad' },
  { to: '/multi-rename', label: 'Multi-Rename' },
  { to: '/settings', label: 'Settings' }
];

export const AppSideNav: React.FC = () => {
  const location = useLocation();

  return (
    <SideNav expanded aria-label="Side navigation" className="app-sidenav">
      <SideNavItems>
        <SideNavLink as={Link} to="/">Home</SideNavLink>
        <SideNavDivider />
        {navLinks.map(link => (
          <SideNavLink 
            as={Link} 
            to={link.to} 
            key={link.to} 
            isActive={location.pathname === link.to}
          >
            {link.label}
          </SideNavLink>
        ))}
      </SideNavItems>
    </SideNav>
  );
}; 