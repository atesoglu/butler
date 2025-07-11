import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from '../pages/Home';
import Textpad from '../pages/Textpad';
import MultiRename from '../pages/MultiRename';
import Settings from '../pages/Settings';

// Helper to map path to breadcrumb
const getBreadcrumb = (pathname: string): string[] => {
  if (pathname.startsWith('/textpad')) return ['Textpad'];
  if (pathname.startsWith('/multi-rename')) return ['Multi-Rename'];
  if (pathname.startsWith('/settings')) return ['Settings'];
  return [];
};

export const AppRoutes: React.FC<{ setBreadcrumb: (crumbs: string[]) => void }> = ({ setBreadcrumb }) => {
  const location = useLocation();
  React.useEffect(() => {
    setBreadcrumb(getBreadcrumb(location.pathname));
  }, [location, setBreadcrumb]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/textpad" element={<Textpad />} />
      <Route path="/multi-rename" element={<MultiRename />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}; 