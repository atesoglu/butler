import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import Home from './pages/Home';
import Textpad from './pages/Textpad';
import MultiRename from './pages/MultiRename';
import Settings from './pages/Settings';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/app.scss';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <div className="app-container">
            <Routes>
              <Route path="/" element={
                <AppLayout breadcrumb={['Home']}>
                  <ErrorBoundary>
                    <Home />
                  </ErrorBoundary>
                </AppLayout>
              } />
              <Route path="/textpad" element={
                <AppLayout breadcrumb={['Textpad']}>
                  <ErrorBoundary>
                    <Textpad />
                  </ErrorBoundary>
                </AppLayout>
              } />
              <Route path="/multi-rename" element={
                <AppLayout breadcrumb={['Multi-Rename']}>
                  <ErrorBoundary>
                    <MultiRename />
                  </ErrorBoundary>
                </AppLayout>
              } />
              <Route path="/settings" element={
                <AppLayout breadcrumb={['Settings']}>
                  <ErrorBoundary>
                    <Settings />
                  </ErrorBoundary>
                </AppLayout>
              } />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
