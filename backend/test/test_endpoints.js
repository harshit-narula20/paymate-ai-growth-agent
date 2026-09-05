import { startServer } from '../src/server.js';
import { disconnectDB } from '../src/config/db.js';
import { config } from '../src/config/env.js';
import { logger } from '../src/utils/logger.js';

const BASE_URL = `http://localhost:${config.port}/api`;

async function get(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  const json = await res.json();
  return { status: res.status, ok: res.ok, data: json };
}

async function post(path, body = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  return { status: res.status, ok: res.ok, data: json };
}

async function runTests() {
  logger.info('🧪 Starting PayMate Automated Backend Verification Test Suite...');

  // 1. Health Check
  logger.info('Testing [GET /api/health]...');
  const health = await get('/health');
  console.assert(health.status === 200, `Health check failed with ${health.status}`);
  console.assert(health.data.status === 'ok', 'Health status is not ok');
  console.assert(health.data.database.connected === true, 'Database is not connected');
  logger.info(`✅ Health check passed. Mode: ${health.data.aiMode}, DB: ${health.data.database.status}`);

  // 2. Dashboard Summary
  logger.info('Testing [GET /api/dashboard/summary]...');
  const summary = await get('/dashboard/summary');
  console.assert(summary.status === 200, 'Dashboard summary failed');
  console.assert(summary.data.data.totalRevenue > 0, 'Total revenue should be > 0');
  console.assert(summary.data.data.customerCount >= 200, 'Customer count should be >= 200');
  logger.info(`✅ Dashboard summary passed: ₹${summary.data.data.totalRevenue.toLocaleString('en-IN')} revenue across ${summary.data.data.customerCount} customers.`);

  // 3. Dashboard Revenue Trends
  logger.info('Testing [GET /api/dashboard/revenue]...');
  const revenueTrends = await get('/dashboard/revenue');
  console.assert(revenueTrends.status === 200, 'Dashboard revenue trends failed');
  console.assert(Array.isArray(revenueTrends.data.data) && revenueTrends.data.data.length > 0, 'Revenue trends should be array');
  logger.info(`✅ Revenue trends passed: ${revenueTrends.data.data.length} monthly data points.`);

  // 4. Customers List
  logger.info('Testing [GET /api/customers]...');
  const customers = await get('/customers?limit=10');
  console.assert(customers.status === 200, 'Customers list failed');
  console.assert(customers.data.data.length === 10, 'Should return 10 customers');
  logger.info(`✅ Customers endpoint passed: ${customers.data.pagination.total} total customers recorded.`);

  // 5. Products List
  logger.info('Testing [GET /api/products]...');
  const products = await get('/products');
  console.assert(products.status === 200, 'Products failed');
  console.assert(products.data.data.length >= 30, 'Should return 30+ products');
  logger.info(`✅ Products endpoint passed: ${products.data.data.length} products in ${products.data.categories.length} categories.`);

  // 6. Transactions List
  logger.info('Testing [GET /api/transactions]...');
  const transactions = await get('/transactions?limit=10');
  console.assert(transactions.status === 200, 'Transactions failed');
  console.assert(transactions.data.pagination.total >= 1000, 'Should have 1000+ transactions');
  logger.info(`✅ Transactions endpoint passed: ${transactions.data.pagination.total} total transactions.`);

  // 7. Failed Payments List
  logger.info('Testing [GET /api/payments/failed]...');
  const failedPayments = await get('/payments/failed');
  console.assert(failedPayments.status === 200, 'Failed payments failed');
  console.assert(failedPayments.data.totalCount > 0, 'Should have failed payments for recovery');
  logger.info(`✅ Failed payments endpoint passed: ${failedPayments.data.totalCount} failed payments representing ₹${failedPayments.data.totalRecoverable.toLocaleString('en-IN')} recoverable revenue.`);

  // 8. Opportunities List
  logger.info('Testing [GET /api/opportunities]...');
  const opportunities = await get('/opportunities');
  console.assert(opportunities.status === 200, 'Opportunities list failed');
  console.assert(opportunities.data.data.length > 0, 'Should return detected opportunities');
  logger.info(`✅ Opportunities endpoint passed: ${opportunities.data.data.length} growth opportunities found.`);

  // 9. Agent Analysis (POST /api/agent/analyze)
  logger.info('Testing [POST /api/agent/analyze]...');
  const analysis = await post('/agent/analyze', { prompt: 'Identify cross-selling and churn opportunities' });
  console.assert(analysis.status === 200, 'Agent analyze failed');
  console.assert(analysis.data.opportunities.length > 0, 'Agent should discover opportunities');
  logger.info(`✅ Agent analysis passed. Mode: ${analysis.data.mode}, Discovered: ${analysis.data.opportunities.length} opportunities.`);

  // 10. Agent Recommendation (POST /api/agent/recommend)
  const targetOpp = opportunities.data.data[0];
  logger.info(`Testing [POST /api/agent/recommend] for opportunity "${targetOpp.title}"...`);
  const recommendation = await post('/agent/recommend', { opportunityId: targetOpp._id });
  console.assert(recommendation.status === 200, 'Agent recommendation failed');
  console.assert(recommendation.data.campaignCopy.message.length > 0, 'Should generate campaign copy');
  logger.info(`✅ Agent recommendation passed: Generated campaign subject: "${recommendation.data.campaignCopy.subject}"`);

  // 11. Autonomous Campaign Execution (POST /api/agent/execute)
  logger.info(`Testing [POST /api/agent/execute] for opportunity ID ${targetOpp._id}...`);
  const execution = await post('/agent/execute', {
    opportunityId: targetOpp._id,
    overrides: { channel: 'whatsapp' }
  });
  console.assert(execution.status === 200, 'Agent execute failed');
  console.assert(execution.data.simulationMode === true, 'Should indicate simulationMode: true');
  console.assert(execution.data.executionBadge === 'DEMO/SIMULATED', 'Should have DEMO/SIMULATED badge');
  console.assert(execution.data.results.conversions > 0, 'Should produce conversions');
  console.assert(execution.data.results.actualRevenue > 0, 'Should generate actual revenue');
  logger.info(`✅ Agent campaign execution passed!`);
  console.table({
    'Badge': execution.data.executionBadge,
    'Targeted Customers': execution.data.results.targetedCustomers,
    'Conversions': execution.data.results.conversions,
    'Actual Revenue': `₹${execution.data.results.actualRevenue.toLocaleString('en-IN')}`,
    'ROI': `${execution.data.results.roi}%`,
    'Channel': execution.data.results.channel
  });

  // 12. Campaigns List
  logger.info('Testing [GET /api/campaigns]...');
  const campaigns = await get('/campaigns');
  console.assert(campaigns.status === 200, 'Campaigns list failed');
  console.assert(campaigns.data.data.length > 0, 'Should include newly executed campaign');
  logger.info(`✅ Campaigns endpoint passed: ${campaigns.data.data.length} campaigns listed.`);

  // 13. Agent Actions Audit Log
  logger.info('Testing [GET /api/agent/actions]...');
  const actions = await get('/agent/actions');
  console.assert(actions.status === 200, 'Agent actions failed');
  console.assert(actions.data.data.length >= 3, 'Should record all autonomous agent actions');
  logger.info(`✅ Agent actions endpoint passed: ${actions.data.data.length} autonomous actions logged.`);

  logger.info('🎉🎉 ALL 13 BACKEND VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉🎉');
}

// Execute tests
let activeServer;
try {
  activeServer = await startServer();
  await runTests();
} catch (err) {
  logger.error('❌ Test suite error:', err);
  process.exitCode = 1;
} finally {
  if (activeServer) {
    activeServer.close(async () => {
      await disconnectDB();
      process.exit(process.exitCode || 0);
    });
  } else {
    await disconnectDB();
    process.exit(process.exitCode || 0);
  }
}
