# PayMate - AI-Powered Autonomous Growth Agent for Commerce

> **Track**: AI Growth & Agentic Commerce  
> **Autonomous Merchant Growth Agent**: Continuous revenue leakage detection, cross-sell discovery, churn prevention, 1-click payment recovery, and autonomous campaign execution with human-in-the-loop safeguards.

---

## 🎯 The Agentic Workflow

PayMate is not just a chatbot and not just a passive dashboard. It executes a closed-loop autonomous cycle:

```
DATA 
  ➔ ANALYSIS 
  ➔ OPPORTUNITY DISCOVERY 
  ➔ AI REASONING & COPY GENERATION 
  ➔ RECOMMENDED ACTION 
  ➔ MERCHANT APPROVAL 
  ➔ AUTONOMOUS CAMPAIGN EXECUTION [SIMULATED] 
  ➔ RESULT & ROI TRACKING 
  ➔ MEASURED REVENUE IMPACT
```

---

## 🚀 Key Features Built in Prompt 1 (Backend Foundation)

1. **Deterministic Business Analytics Engine**
   - Exact financial calculations independent of the LLM (Total GMV, AOV, Customer LTV, Churn Risk, Repeat Purchase Rate, Recoverable Revenue).
   - Cohort detection algorithms:
     - **Cross-Sell**: Running shoe purchasers with zero accessories.
     - **Payment Recovery**: Failed checkout transactions due to banking timeouts or declines.
     - **Win-Back**: Dormant repeat buyers (2+ past orders) inactive >60 days.
     - **Churn Prevention**: Top-decile LTV customers displaying churn threshold signals.
     - **High-Intent Conversion**: Active frequent shoppers ready for VIP bundles.

2. **Dual-Mode AI Agent (`OpenAI` + `Deterministic Demo AI`)**
   - Automatically switches based on `OPENAI_API_KEY`.
   - **Demo AI Fallback**: Dynamically analyzes live MongoDB records and product catalogs with structured reasoning and copywriting (zero hallucinations, zero hardcoding).
   - Transparent mode badge exposed via `/api/health` and `/api/agent/analyze`.

2. **Complete Fintech SaaS Frontend (React + Vite + Tailwind + Recharts)**
   - **Executive Dashboard** (`/dashboard`): Live GMV, Revenue at Risk, Recoverable failed checkouts, 6-month revenue trends chart, customer cohort distribution, top opportunities, and AgentAction audit logs.
   - **Interactive AI Agent Console** (`/agent`): Natural language merchant query interface ("Find my biggest growth opportunity", "Which customers are most likely to churn?"), structured reasoning cards, confidence scoring, and one-click campaign launch.
   - **Opportunity Engine** (`/opportunities` & `/opportunities/:id`): Categorized cards (Cross-Sell, Win-Back, Churn Prevention, Payment Recovery, High Intent), full business rationale, and cohort preview.
   - **Campaign Management Hub** (`/campaigns` & `/campaigns/:id`): Complete tracking of autonomous campaigns, delivered copy templates, conversions, actual revenue, and channel ROI.
   - **Customer Intelligence CRM** (`/customers` & `/customers/:id`): 220+ seeded customer profiles with segment filters, churn risk indicators, transaction history, and 1-on-1 AI offer generator.
   - **Catalog & Inventory** (`/products`): 30+ products across 5 categories with stock levels and generated GMV.
   - **Transaction Ledger** (`/transactions`): Filterable feed of 1,050+ store orders and payment statuses.
   - **Advanced Growth Analytics** (`/analytics`): Multi-stage commerce conversion funnel, cohort leakage breakdown, and AI-attributed revenue.
   - **Agent Activity Feed** (`/activity`): Immutable audit trail of autonomous AI evaluations and executions directly from MongoDB.
   - **Merchant Settings** (`/settings`): Human-in-the-loop autonomous guardrails, confidence threshold slider, and AI engine status.

3. **Autonomous Campaign Execution & Simulation Engine**
   - Validates opportunities and target customer cohorts.
   - Generates personalized marketing copy (WhatsApp, Email, SMS).
   - Simulates delivery and calculates realistic conversions, actual revenue, and channel ROI.
   - Restores failed checkouts in payment recovery workflows.
   - Transparently badged as `DEMO/SIMULATED`.

4. **AgentAction Audit Trail**
   - Full history of all agent interventions (`analyze_data`, `identify_opportunity`, `generate_recommendation`, `execute_campaign`).

5. **Realistic Seed Data Engine**
   - **220 Customers** grouped into 6 deliberate behavior cohorts.
   - **30 Products** across 5 e-commerce categories.
   - **1,050 Transactions & Payments** spanning 6 months of historical data.

6. **Flexible Data Provider Abstraction**
   - `MongoDataProvider`: Connects to MongoDB / In-Memory MongoDB.
   - `RazorpayDataProvider`: Prepared provider contract for live Razorpay syncing.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB via Mongoose (with automated fallback to `mongodb-memory-server` for zero-setup execution)
- **AI**: OpenAI API (`gpt-4o-mini`) with deterministic fallback engine
- **Testing**: Native automated HTTP integration test suite

---

## 📂 Project Structure

```
paymate/
├── backend/
│   ├── src/
│   │   ├── ai/
│   │   │   ├── agent.js            # Core PayMate Agent logic
│   │   │   ├── demoEngine.js       # Live MongoDB-driven Demo AI
│   │   │   ├── prompts.js          # Structured prompts & schemas
│   │   │   └── tools.js            # Agent tools & OpenAI function specs
│   │   ├── config/
│   │   │   ├── db.js               # Resilient DB connector
│   │   │   └── env.js              # Environment variable loader
│   │   ├── controllers/
│   │   │   ├── agentController.js
│   │   │   ├── campaignController.js
│   │   │   ├── customerController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── opportunityController.js
│   │   │   ├── paymentController.js
│   │   │   ├── productController.js
│   │   │   └── transactionController.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── validate.js
│   │   ├── models/
│   │   │   ├── AgentAction.js
│   │   │   ├── Campaign.js
│   │   │   ├── Customer.js
│   │   │   ├── Merchant.js
│   │   │   ├── Opportunity.js
│   │   │   ├── Payment.js
│   │   │   ├── Product.js
│   │   │   ├── Transaction.js
│   │   │   └── index.js
│   │   ├── routes/
│   │   │   ├── agentRoutes.js
│   │   │   ├── campaignRoutes.js
│   │   │   ├── customerRoutes.js
│   │   │   ├── dashboardRoutes.js
│   │   │   ├── opportunityRoutes.js
│   │   │   ├── paymentRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── transactionRoutes.js
│   │   │   └── index.js
│   │   ├── seed/
│   │   │   ├── seed.js             # Realistic 220+ customers, 1050+ tx
│   │   │   └── seedData.js
│   │   ├── services/
│   │   │   ├── analyticsService.js # Deterministic metrics & detectors
│   │   │   ├── campaignExecutionService.js
│   │   │   └── dataProvider.js     # Mongo / Razorpay provider abstraction
│   │   ├── utils/
│   │   │   └── logger.js
│   │   └── server.js               # Clean server entrypoint with auto-seed
│   ├── test/
│   │   └── test_endpoints.js       # 13 automated integration tests
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
└── README.md
```

---

## ⚡ Quick Start

### 1. Installation
```bash
cd backend
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Optional: Add your `OPENAI_API_KEY`. If left blank, PayMate automatically operates in Demo AI mode).*

### 3. Seed Database
```bash
npm run seed
```

### 4. Run Automated Test Suite
```bash
npm test
```
*Validates all 13 REST endpoints, database queries, and simulated autonomous campaign execution.*

### 5. Start Server
```bash
npm start
# or for auto-reloading dev mode:
npm run dev
```
The server will run on `http://localhost:5000`.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service status, active AI mode, and DB connectivity |
| `GET` | `/api/dashboard/summary` | Deterministic KPIs (Revenue, AOV, LTV, Churn, Recoverable) |
| `GET` | `/api/dashboard/revenue` | Monthly revenue trends for charts |
| `GET` | `/api/customers` | Filterable and paginated customer profiles |
| `GET` | `/api/customers/:id` | Detailed customer profile with transaction history |
| `GET` | `/api/products` | Catalog items and categories |
| `GET` | `/api/transactions` | Order transactions list |
| `GET` | `/api/payments/failed` | Failed transactions for 1-click recovery |
| `GET` | `/api/opportunities` | Discovered growth and retention opportunities |
| `POST` | `/api/agent/analyze` | Triggers autonomous data analysis & opportunity ranking |
| `POST` | `/api/agent/recommend` | Generates AI personalized campaign recommendation |
| `POST` | `/api/agent/execute` | Approves and executes campaign autonomously |
| `GET` | `/api/campaigns` | List of all executed marketing campaigns |
| `GET` | `/api/agent/actions` | Audit log of all autonomous agent actions |
