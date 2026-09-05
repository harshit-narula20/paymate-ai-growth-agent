import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { AgentPage } from './pages/AgentPage';
import { Opportunities } from './pages/Opportunities';
import { OpportunityDetail } from './pages/OpportunityDetail';
import { Customers } from './pages/Customers';
import { CustomerDetail } from './pages/CustomerDetail';
import { Products } from './pages/Products';
import { Transactions } from './pages/Transactions';
import { Campaigns } from './pages/Campaigns';
import { CampaignDetail } from './pages/CampaignDetail';
import { Analytics } from './pages/Analytics';
import { AgentActivity } from './pages/Activity';
import { Settings } from './pages/Settings';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="agent" element={<AgentPage />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="opportunities/:id" element={<OpportunityDetail />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/:id" element={<CustomerDetail />} />
          <Route path="products" element={<Products />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="campaigns/:id" element={<CampaignDetail />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="activity" element={<AgentActivity />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
