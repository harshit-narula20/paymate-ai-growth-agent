# PayMate - AI-Powered Growth Agent for Commerce

> **Track:** AI Growth & Agentic Commerce

PayMate is an AI-powered merchant growth platform that analyzes customer, transaction, and payment data to identify revenue opportunities and recommend actionable growth strategies.

It helps merchants discover opportunities across churn prevention, cross-selling, win-back campaigns, payment recovery, and high-intent customer conversion.

---

## 🎯 How PayMate Works

PayMate follows a closed-loop growth workflow:

Business Data
     ↓
Data Analysis
     ↓
Opportunity Detection
     ↓
AI Reasoning
     ↓
Recommended Action
     ↓
Merchant Approval
     ↓
Campaign Execution
     ↓
Revenue & ROI Tracking

The platform combines deterministic business analytics with an AI-powered recommendation layer to help merchants move from understanding what happened to deciding what to do next.

🚀 Key Features
1. Business Analytics Engine

PayMate calculates important commerce and customer metrics including:

Total Store GMV
Average Order Value (AOV)
Customer Lifetime Value (LTV)
Churn Risk
Repeat Purchase Rate
Revenue at Risk
Recoverable Revenue
AI-attributed Revenue

The analytics engine also identifies customer cohorts and revenue opportunities based on purchasing behavior.

2. Growth Opportunity Detection

PayMate identifies multiple types of growth and retention opportunities:

Cross-Sell — Customers purchasing products such as running shoes but not related accessories.
Payment Recovery — Failed checkout transactions that may be recoverable.
Win-Back — Previously active repeat customers who have become inactive.
Churn Prevention — High-value customers showing behavioral signals associated with churn.
High-Intent Conversion — Frequent and engaged customers who may be suitable for premium offers or bundles.

Each opportunity contains supporting customer information, business reasoning, recommended actions, priority, and estimated revenue impact.

3. AI Growth Agent

The AI Agent allows merchants to interact with their business data using natural-language questions.

Example queries include:

Which customers are most likely to churn?

Find customers suitable for cross-selling.

Which failed payments should I prioritize?

How can I increase revenue this week?

Find my biggest growth opportunity.

The agent analyzes the relevant business data and returns structured recommendations and prioritized opportunities.

4. Customer Intelligence

The Customer Intelligence module provides detailed customer-level insights including:

Customer segments
Total spending
Number of orders
Average order value
Churn risk
Transaction history
Personalized growth recommendations

Merchants can open individual customer profiles and generate targeted offers based on purchasing behavior.

5. Opportunity Management

The Opportunity Engine provides a centralized view of discovered growth opportunities.

Each opportunity includes:

Opportunity category
Target customer or cohort
Business rationale
Recommended action
Estimated revenue impact
Priority

This allows merchants to focus on opportunities with the highest potential business value.

6. Campaign Management

Merchants can review recommended campaigns and initiate actions from identified opportunities.

The campaign workflow supports simulated:

WhatsApp campaigns
Email campaigns
SMS campaigns
Payment recovery workflows

For the current hackathon version, campaign delivery and conversion results are simulated for demonstration purposes.

7. Growth Analytics

The Analytics section provides a broader view of merchant performance through:

Revenue progression
Commerce conversion funnel
Customer cohort analysis
Revenue leakage
AI-attributed revenue
Growth opportunity metrics

This helps merchants understand both historical performance and potential areas for improvement.

8. Agent Activity & Audit Trail

PayMate maintains an activity history of important agent operations, including:

Data analysis
Opportunity identification
Recommendation generation
Campaign execution

This provides visibility into the decisions and actions performed by the growth agent.

9. Realistic Commerce Dataset

The project includes a realistic seeded commerce dataset containing:

220+ customers
30+ products
1,050+ transactions
Payment records
Multiple customer behavior cohorts
Six months of historical commerce activity

The dataset is designed to demonstrate scenarios involving churn, cross-selling, payment recovery, win-back campaigns, and high-intent customers.

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts
- Lucide React

### Backend

- Node.js
- Express.js
- ES Modules

### Database

- MongoDB
- Mongoose

### AI

- OpenAI API
- Deterministic business-analysis engine

### Testing

- Node.js HTTP integration tests
- Automated backend endpoint validation

---

## 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │      Merchant       │
                         │   React Dashboard   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     Express API     │
                         │    Backend Server   │
                         └──────────┬──────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
          ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
          │   MongoDB    │  │   Business   │  │  AI Growth   │
          │   Database   │  │   Analytics  │  │    Agent     │
          └──────────────┘  └──────────────┘  └───────┬──────┘
                                                      │
                                                      ▼
                                            ┌───────────────────┐
                                            │   Opportunities   │
                                            │ & Recommendations │
                                            └─────────┬─────────┘
                                                      │
                                                      ▼
                                            ┌───────────────────┐
                                            │ Merchant Approval │
                                            └─────────┬─────────┘
                                                      │
                                                      ▼
                                            ┌───────────────────┐
                                            │ Campaign Execution│
                                            │      (Demo)       │
                                            └─────────┬─────────┘
                                                      │
                                                      ▼
                                            ┌───────────────────┐
                                            │ Revenue & ROI Data│
                                            └───────────────────┘

📂 Project Structure
paymate-ai-growth-agent/
│
├── backend/
│   ├── src/
│   │   ├── ai/
│   │   │   ├── agent.js
│   │   │   ├── demoEngine.js
│   │   │   ├── prompts.js
│   │   │   └── tools.js
│   │   │
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── agentController.js
│   │   │   ├── campaignController.js
│   │   │   ├── customerController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── opportunityController.js
│   │   │   ├── paymentController.js
│   │   │   ├── productController.js
│   │   │   └── transactionController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── validate.js
│   │   │
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
│   │   │
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
│   │   │
│   │   ├── seed/
│   │   │   ├── seed.js
│   │   │   └── seedData.js
│   │   │
│   │   ├── services/
│   │   │   ├── analyticsService.js
│   │   │   ├── campaignExecutionService.js
│   │   │   └── dataProvider.js
│   │   │
│   │   ├── utils/
│   │   │   └── logger.js
│   │   │
│   │   └── server.js
│   │
│   ├── test/
│   │   └── test_endpoints.js
│   │
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── package.json
├── start.js
└── README.md
⚡ Quick Start
Prerequisites

Make sure you have:

Node.js 18+
npm
MongoDB
1. Clone the repository
git clone https://github.com/harshit-narula20/paymate-ai-growth-agent.git
cd paymate-ai-growth-agent
2. Install backend dependencies
cd backend
npm install
3. Configure environment variables

Create a .env file using the provided example:

cp .env.example .env

Configure your MongoDB connection settings.

An OpenAI API key can be added when external AI processing is enabled. If no key is configured, PayMate uses its deterministic demonstration engine.

Important: Never commit your .env file or API keys to the repository.

4. Seed the database
npm run seed

This creates the demo merchant, customer profiles, products, transactions, payments, and growth opportunities.

5. Start the backend
npm run dev

The backend runs on:

http://localhost:5000

6. Start the frontend

Open a second terminal:

cd frontend
npm install
npm run dev

Open the Vite URL displayed in the terminal.

🧪 Testing

The backend includes an automated HTTP integration test suite.

Run:

cd backend
npm test

The test suite validates the core API endpoints, database operations, analytics, opportunity discovery, and campaign execution workflows.

📡 REST API
Method	Endpoint	Description
GET	/api/health	Service and database status
GET	/api/dashboard/summary	Core merchant KPIs
GET	/api/dashboard/revenue	Revenue trend data
GET	/api/customers	Customer profiles
GET	/api/customers/:id	Customer details and transaction history
GET	/api/products	Product catalog
GET	/api/transactions	Transaction history
GET	/api/payments/failed	Failed payment records
GET	/api/opportunities	Growth opportunities
POST	/api/agent/analyze	Analyze a merchant query
POST	/api/agent/recommend	Generate a growth recommendation
POST	/api/agent/execute	Execute a selected campaign workflow
GET	/api/campaigns	Campaign records
GET	/api/agent/actions	Agent activity history
🔐 Responsible Automation
```

PayMate is designed with merchant oversight in mind.

The workflow allows merchants to review identified opportunities and recommended actions before initiating campaign execution.

The current hackathon version uses simulated campaign execution. It does not send real customer communications or process live payments.

This architecture can be extended with production messaging and payment integrations.

🎥 Demo

The 5-minute product walkthrough demonstrates:

Merchant dashboard
Customer intelligence
AI Growth Agent
Churn analysis
Cross-selling opportunities
Payment recovery
Opportunity prioritization
Campaign workflow
Growth analytics
[▶️ Watch the PayMate 5-Minute Pitch & Demo](https://drive.google.com/file/d/1Fts9cgztuKaLfYxqOxg8-Z30H534Wl7x/view?usp=drive_link)


📸 Product Screenshots
Merchant Dashboard

The main dashboard provides a high-level view of store performance, customer metrics, revenue risk, recoverable revenue, and identified opportunities.


<img width="1896" height="901" alt="image" src="https://github.com/user-attachments/assets/e6f1484d-dee5-4ed1-9fad-ff8b3ac3beff" />

AI Growth Agent

The AI Agent allows merchants to ask natural-language questions and receive business-specific recommendations.

<img width="1890" height="905" alt="image" src="https://github.com/user-attachments/assets/64cd4111-e74d-4326-b464-2df79ece37b0" />

Customer Intelligence

Individual customer profiles include purchase behavior, transaction history, churn risk, and AI-generated recommendations.

<img width="1890" height="905" alt="image" src="https://github.com/user-attachments/assets/49630bb0-afa4-4954-8610-40abf0e7acf1" />

Growth Analytics

Analytics provides revenue progression, conversion funnel analysis, customer behavior insights, and AI-attributed revenue.

<img width="1896" height="906" alt="image" src="https://github.com/user-attachments/assets/1aff09c4-f814-42fd-b086-9805a72d05ce" />

🔮 Future Scope

Potential future extensions include:

Live Razorpay data synchronization
Real payment recovery links
WhatsApp Business integration
Production messaging integrations
Advanced customer segmentation
Continuous opportunity monitoring
Improved revenue attribution
Production-grade merchant authentication
Multi-merchant account management
Real-time commerce event processing
💡 Why PayMate?

Traditional business dashboards tell merchants what happened.

PayMate goes a step further by helping merchants understand:

Who needs attention?
Why do they need attention?
What action should be taken?
What revenue could that action recover or generate?

The goal is to turn business data into prioritized, actionable growth decisions.
