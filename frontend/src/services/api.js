import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error extraction
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.error?.message || error.message || 'An unexpected network error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };
    return Promise.reject(customError);
  }
);

export const api = {
  // Health
  getHealth: () => apiClient.get('/health').then(r => r.data),

  // Dashboard
  getDashboardSummary: () => apiClient.get('/dashboard/summary').then(r => r.data),
  getDashboardRevenue: (months = 6) => apiClient.get(`/dashboard/revenue?months=${months}`).then(r => r.data),

  // Customers
  getCustomers: (params = {}) => apiClient.get('/customers', { params }).then(r => r.data),
  getCustomerById: (id) => apiClient.get(`/customers/${id}`).then(r => r.data),

  // Products
  getProducts: (params = {}) => apiClient.get('/products', { params }).then(r => r.data),

  // Transactions
  getTransactions: (params = {}) => apiClient.get('/transactions', { params }).then(r => r.data),

  // Payments
  getPayments: (params = {}) => apiClient.get('/payments', { params }).then(r => r.data),
  getFailedPayments: () => apiClient.get('/payments/failed').then(r => r.data),

  // Opportunities
  getOpportunities: (params = {}) => apiClient.get('/opportunities', { params }).then(r => r.data),
  getOpportunityById: (id) => apiClient.get(`/opportunities/${id}`).then(r => r.data),
  updateOpportunityStatus: (id, status) => apiClient.patch(`/opportunities/${id}/status`, { status }).then(r => r.data),

  // AI Agent
  analyzeAgent: (prompt) => apiClient.post('/agent/analyze', { prompt }).then(r => r.data),
  recommendAgent: (opportunityId) => apiClient.post('/agent/recommend', { opportunityId }).then(r => r.data),
  executeAgent: (opportunityId, overrides = {}) => apiClient.post('/agent/execute', { opportunityId, overrides }).then(r => r.data),
  getAgentActions: (params = {}) => apiClient.get('/agent/actions', { params }).then(r => r.data),

  // Campaigns
  getCampaigns: (params = {}) => apiClient.get('/campaigns', { params }).then(r => r.data),
  getCampaignById: (id) => apiClient.get(`/campaigns/${id}`).then(r => r.data),
  createCampaign: (data) => apiClient.post('/campaigns', data).then(r => r.data),
  executeCampaign: (id) => apiClient.post(`/campaigns/${id}/execute`).then(r => r.data),
};

export default apiClient;
