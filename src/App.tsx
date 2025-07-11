import React from 'react';
import { HashRouter } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { AppRoutes } from './routes/AppRoutes';

const App: React.FC = () => {
  const [breadcrumb, setBreadcrumb] = React.useState<string[]>([]);
  return (
    <HashRouter>
      <AppLayout breadcrumb={breadcrumb}>
        <AppRoutes setBreadcrumb={setBreadcrumb} />
      </AppLayout>
    </HashRouter>
  );
};

export default App;
