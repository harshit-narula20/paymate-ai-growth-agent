import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import { Customer, Product, Transaction, Payment, Campaign, Opportunity, AgentAction, Merchant } from '../models/index.js';
import { PRODUCTS_SEED, FIRST_NAMES, LAST_NAMES } from './seedData.js';
import { AnalyticsService } from '../services/analyticsService.js';
import { logger } from '../utils/logger.js';

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPhone() {
  return `+91 98${randomInt(10000000, 99999999)}`;
}

export async function runSeed() {
  logger.info('🌱 Starting PayMate Realistic Database Seeding...');
  await connectDB();

  // Clear existing data
  logger.info('Clearing old collections...');
  await Promise.all([
    Customer.deleteMany({}),
    Product.deleteMany({}),
    Transaction.deleteMany({}),
    Payment.deleteMany({}),
    Campaign.deleteMany({}),
    Opportunity.deleteMany({}),
    AgentAction.deleteMany({}),
    Merchant.deleteMany({})
  ]);

  // 1. Create Default Merchant
  const merchant = await Merchant.create({
    name: 'Vikram Malhotra',
    email: 'vikram@apexathletics.in',
    businessName: 'Apex Athletics & Commerce',
    businessType: 'sports_apparel_and_footwear',
    currency: 'INR',
    settings: {
      autonomousExecution: false,
      minConfidenceThreshold: 0.80,
      preferredChannels: ['whatsapp', 'email']
    }
  });
  logger.info(`✅ Seeded Merchant: ${merchant.businessName}`);

  // 2. Insert Products
  const insertedProducts = await Product.insertMany(PRODUCTS_SEED);
  logger.info(`✅ Seeded ${insertedProducts.length} Products`);

  const shoeProducts = insertedProducts.filter(p => p.category === 'Running Shoes' || p.category === 'Athletic Shoes');
  const accessoryProducts = insertedProducts.filter(p => p.category === 'Accessories');
  const apparelProducts = insertedProducts.filter(p => p.category === 'Apparel');
  const fitnessProducts = insertedProducts.filter(p => p.category === 'Fitness Gear');
  const nonShoeProducts = [...accessoryProducts, ...apparelProducts, ...fitnessProducts];

  // 3. Generate 220+ Customers with Deliberate Cohorts
  const customerSpecs = [];

  // Cohort A: 50 Shoe Buyers (Bought running/athletic shoes, ZERO accessories)
  for (let i = 0; i < 50; i++) {
    customerSpecs.push({
      cohort: 'shoe_buyer',
      segment: 'shoe_buyer',
      purchaseCount: randomInt(1, 2),
      churnRisk: 'low',
      daysAgo: randomInt(5, 45)
    });
  }

  // Cohort B: 45 Inactive Customers (Previously high repeat buyers, no purchase > 65-150 days)
  for (let i = 0; i < 45; i++) {
    customerSpecs.push({
      cohort: 'inactive',
      segment: 'inactive',
      purchaseCount: randomInt(2, 4),
      churnRisk: 'high',
      daysAgo: randomInt(65, 150)
    });
  }

  // Cohort C: 35 High-LTV VIP Customers (5-10 purchases, large spend, some at risk)
  for (let i = 0; i < 35; i++) {
    const isAtRisk = i < 15;
    customerSpecs.push({
      cohort: 'high_ltv',
      segment: 'high_ltv',
      purchaseCount: randomInt(5, 9),
      churnRisk: isAtRisk ? 'high' : 'medium',
      daysAgo: isAtRisk ? randomInt(55, 90) : randomInt(4, 25)
    });
  }

  // Cohort D: 40 Loyal Active Buyers (3-6 purchases, recent, low churn)
  for (let i = 0; i < 40; i++) {
    customerSpecs.push({
      cohort: 'loyal',
      segment: 'loyal',
      purchaseCount: randomInt(3, 6),
      churnRisk: 'low',
      daysAgo: randomInt(3, 28)
    });
  }

  // Cohort E: 30 Failed Payment Customers (Recent failed checkouts)
  for (let i = 0; i < 30; i++) {
    customerSpecs.push({
      cohort: 'failed_payment',
      segment: 'failed_payment',
      purchaseCount: 0,
      churnRisk: 'medium',
      daysAgo: randomInt(1, 14)
    });
  }

  // Cohort F: 20 New Customers (1 purchase in last 10 days)
  for (let i = 0; i < 20; i++) {
    customerSpecs.push({
      cohort: 'new',
      segment: 'new',
      purchaseCount: 1,
      churnRisk: 'low',
      daysAgo: randomInt(1, 12)
    });
  }

  // Create Customer Documents
  const customerDocs = [];
  const usedEmails = new Set();

  for (let i = 0; i < customerSpecs.length; i++) {
    const spec = customerSpecs[i];
    const fn = FIRST_NAMES[i % FIRST_NAMES.length];
    const ln = LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length] || LAST_NAMES[i % LAST_NAMES.length];
    const name = `${fn} ${ln}`;
    let email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i + 10}@example.com`;
    while (usedEmails.has(email)) {
      email = `${fn.toLowerCase()}.${ln.toLowerCase()}${randomInt(100, 9999)}@example.com`;
    }
    usedEmails.add(email);

    const lastPurchaseDate = new Date(Date.now() - spec.daysAgo * 24 * 60 * 60 * 1000);

    customerDocs.push({
      name,
      email,
      phone: randomPhone(),
      segment: spec.segment,
      totalSpent: 0, // Will be computed from transactions
      purchaseCount: spec.purchaseCount,
      lastPurchaseDate,
      averageOrderValue: 0,
      churnRisk: spec.churnRisk,
      createdAt: new Date(Date.now() - (spec.daysAgo + randomInt(30, 180)) * 24 * 60 * 60 * 1000)
    });
  }

  const insertedCustomers = await Customer.insertMany(customerDocs);
  logger.info(`✅ Seeded ${insertedCustomers.length} Customers across 6 targeted cohorts`);

  // 4. Generate 1000+ Realistic Transactions & Payments
  const transactionDocs = [];
  const paymentDocs = [];
  const customerUpdates = new Map();

  for (let i = 0; i < insertedCustomers.length; i++) {
    const customer = insertedCustomers[i];
    const spec = customerSpecs[i];

    customerUpdates.set(customer._id.toString(), {
      totalSpent: 0,
      purchaseCount: 0,
      orders: []
    });

    // Special Case: Failed Payment Cohort
    if (spec.cohort === 'failed_payment') {
      const numFailed = randomInt(1, 2);
      for (let f = 0; f < numFailed; f++) {
        const product = randomChoice(shoeProducts);
        const qty = 1;
        const totalAmount = product.price * qty;
        const txDate = new Date(Date.now() - randomInt(1, 10) * 24 * 60 * 60 * 1000);

        const txId = new mongoose.Types.ObjectId();
        transactionDocs.push({
          _id: txId,
          customerId: customer._id,
          products: [{ productId: product._id, name: product.name, category: product.category, price: product.price, quantity: qty }],
          totalAmount,
          paymentStatus: 'failed',
          paymentMethod: randomChoice(['card', 'upi', 'netbanking']),
          transactionDate: txDate
        });

        paymentDocs.push({
          transactionId: txId,
          customerId: customer._id,
          amount: totalAmount,
          status: 'failed',
          failureReason: randomChoice(['gateway_timeout', 'bank_declined', 'insufficient_funds', 'authentication_failed']),
          retryCount: randomInt(0, 2),
          createdAt: txDate
        });
      }
      continue;
    }

    // Standard / Successful Buyer Cohorts
    const purchasesToGenerate = spec.purchaseCount;
    for (let p = 0; p < purchasesToGenerate; p++) {
      let orderProducts = [];
      let totalAmount = 0;

      if (spec.cohort === 'shoe_buyer') {
        // Only buy Running Shoes or Athletic Shoes, NEVER accessories!
        const shoe = randomChoice(shoeProducts);
        orderProducts.push({
          productId: shoe._id,
          name: shoe.name,
          category: shoe.category,
          price: shoe.price,
          quantity: 1
        });
        totalAmount += shoe.price;
      } else if (spec.cohort === 'high_ltv') {
        // High-LTV orders have 2-4 items, mix of shoes, apparel, gear
        const count = randomInt(2, 4);
        for (let k = 0; k < count; k++) {
          const item = randomChoice(insertedProducts);
          orderProducts.push({
            productId: item._id,
            name: item.name,
            category: item.category,
            price: item.price,
            quantity: 1
          });
          totalAmount += item.price;
        }
      } else {
        // Regular mix
        const item = randomChoice(insertedProducts);
        orderProducts.push({
          productId: item._id,
          name: item.name,
          category: item.category,
          price: item.price,
          quantity: 1
        });
        totalAmount += item.price;
        if (Math.random() > 0.6) {
          const second = randomChoice(nonShoeProducts);
          orderProducts.push({
            productId: second._id,
            name: second.name,
            category: second.category,
            price: second.price,
            quantity: 1
          });
          totalAmount += second.price;
        }
      }

      // Spread dates back from lastPurchaseDate
      const offsetDays = p === 0 ? 0 : randomInt(15, 45) * p;
      const txDate = new Date(customer.lastPurchaseDate.getTime() - offsetDays * 24 * 60 * 60 * 1000);

      const txId = new mongoose.Types.ObjectId();
      transactionDocs.push({
        _id: txId,
        customerId: customer._id,
        products: orderProducts,
        totalAmount,
        paymentStatus: 'completed',
        paymentMethod: randomChoice(['card', 'upi', 'netbanking', 'wallet']),
        transactionDate: txDate
      });

      paymentDocs.push({
        transactionId: txId,
        customerId: customer._id,
        amount: totalAmount,
        status: 'success',
        failureReason: null,
        retryCount: 0,
        createdAt: txDate
      });

      const custData = customerUpdates.get(customer._id.toString());
      custData.totalSpent += totalAmount;
      custData.purchaseCount += 1;
    }
  }

  // Add additional historical transaction volume to cross 1000+ transactions
  logger.info(`Generated initial cohort transactions (${transactionDocs.length}). Adding historical transactions to reach 1000+...`);
  const activeCusts = insertedCustomers.filter(c => c.segment !== 'failed_payment');
  
  while (transactionDocs.length < 1050) {
    const cust = randomChoice(activeCusts);
    const item = randomChoice(insertedProducts);
    const totalAmount = item.price;
    const daysAgo = randomInt(15, 175);
    const txDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    const isSuccess = Math.random() > 0.08; // 92% success rate
    const txId = new mongoose.Types.ObjectId();

    transactionDocs.push({
      _id: txId,
      customerId: cust._id,
      products: [{
        productId: item._id,
        name: item.name,
        category: item.category,
        price: item.price,
        quantity: 1
      }],
      totalAmount,
      paymentStatus: isSuccess ? 'completed' : 'failed',
      paymentMethod: randomChoice(['card', 'upi', 'netbanking']),
      transactionDate: txDate
    });

    paymentDocs.push({
      transactionId: txId,
      customerId: cust._id,
      amount: totalAmount,
      status: isSuccess ? 'success' : 'failed',
      failureReason: isSuccess ? null : randomChoice(['gateway_timeout', 'bank_declined', 'insufficient_funds']),
      retryCount: isSuccess ? 0 : randomInt(0, 2),
      createdAt: txDate
    });

    if (isSuccess) {
      const custData = customerUpdates.get(cust._id.toString());
      if (custData) {
        custData.totalSpent += totalAmount;
        custData.purchaseCount += 1;
      }
    }
  }

  logger.info(`Inserting ${transactionDocs.length} Transactions into MongoDB...`);
  await Transaction.insertMany(transactionDocs);

  logger.info(`Inserting ${paymentDocs.length} Payment records into MongoDB...`);
  await Payment.insertMany(paymentDocs);

  // Update Customer aggregate fields (totalSpent, averageOrderValue, purchaseCount)
  logger.info('Updating customer aggregated spend statistics...');
  const bulkCustOps = [];
  for (const [id, data] of customerUpdates.entries()) {
    const aov = data.purchaseCount > 0 ? Math.round(data.totalSpent / data.purchaseCount) : 0;
    bulkCustOps.push({
      updateOne: {
        filter: { _id: id },
        update: {
          $set: {
            totalSpent: data.totalSpent,
            purchaseCount: data.purchaseCount,
            averageOrderValue: aov
          }
        }
      }
    });
  }

  if (bulkCustOps.length > 0) {
    await Customer.bulkWrite(bulkCustOps);
  }

  // 5. Seed Opportunities via deterministic business analytics
  logger.info('Running Business Analytics Engine to detect initial opportunities...');
  const initialOpportunities = await AnalyticsService.generateAllOpportunities();

  const savedOpps = await Opportunity.insertMany(initialOpportunities);
  logger.info(`✅ Seeded ${savedOpps.length} High-Impact Growth Opportunities`);

  // 6. Record Initial Seed Agent Action
  await AgentAction.create({
    actionType: 'analyze_data',
    input: { trigger: 'seed_init', cohortSize: customerSpecs.length },
    output: {
      opportunitiesDiscovered: savedOpps.length,
      estimatedPipelineGMV: savedOpps.reduce((sum, o) => sum + o.estimatedRevenue, 0)
    },
    status: 'completed',
    aiProvider: 'demo'
  });
  logger.info('✅ Recorded AgentAction log');

  logger.info('🎉 Database Seeding Completed Successfully!');
  const summary = await AnalyticsService.getDashboardSummary();
  console.table({
    'Total Customers': summary.customerCount,
    'Total Transactions': summary.transactionCount,
    'Total Revenue (INR)': `₹${summary.totalRevenue.toLocaleString('en-IN')}`,
    'AOV (INR)': `₹${summary.averageOrderValue.toLocaleString('en-IN')}`,
    'Customer LTV (INR)': `₹${summary.customerLifetimeValue.toLocaleString('en-IN')}`,
    'Repeat Purchase Rate': `${summary.repeatPurchaseRate}%`,
    'Failed Payments': summary.failedPaymentsCount,
    'Recoverable Revenue (INR)': `₹${summary.recoverableRevenue.toLocaleString('en-IN')}`,
    'Revenue At Risk (INR)': `₹${summary.revenueAtRisk.toLocaleString('en-IN')}`,
    'Identified Opportunities': summary.activeOpportunitiesCount,
    'Pipeline Opportunity GMV': `₹${summary.potentialRevenueOpportunity.toLocaleString('en-IN')}`
  });

  return summary;
}

// Auto-run if executed directly via node src/seed/seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  runSeed()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch(async (err) => {
      logger.error('Seed script failed:', err);
      await disconnectDB();
      process.exit(1);
    });
}
