import OpenAI from 'openai';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { DemoAIEngine } from './demoEngine.js';
import { SYSTEM_PROMPT, OPPORTUNITY_ANALYSIS_PROMPT, CAMPAIGN_GENERATION_PROMPT } from './prompts.js';
import { agentTools, toolDefinitions } from './tools.js';
import { Opportunity, AgentAction, Campaign, Customer } from '../models/index.js';
import { AnalyticsService } from '../services/analyticsService.js';

let openaiClient = null;
if (config.openaiApiKey && config.openaiApiKey.trim() !== '') {
  try {
    openaiClient = new OpenAI({ apiKey: config.openaiApiKey });
    logger.info('OpenAI client initialized for PayMate Agent');
  } catch (err) {
    logger.warn('Failed to initialize OpenAI client, using Demo AI engine:', err.message);
  }
}

export class PayMateAgent {
  /**
   * Return current active AI mode
   */
  static getAIMode() {
    return (openaiClient && config.openaiApiKey) ? 'AI Mode: OpenAI' : 'AI Mode: Demo';
  }

  /**
   * Core Agentic Method: Analyze business data, identify and rank revenue opportunities
   */
  static async analyzeBusinessData(userPrompt = '') {
    const aiMode = this.getAIMode();
    logger.agent(`Running Autonomous Growth Agent Analysis. Current mode: [${aiMode}]`);

    const startTime = Date.now();

    // 1. If in OpenAI mode, query OpenAI with live context
    if (openaiClient && config.aiProvider === 'openai') {
      try {
        const [summary, segments] = await Promise.all([
          AnalyticsService.getDashboardSummary(),
          agentTools.getCustomerSegments()
        ]);

        const response = await openaiClient.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: OPPORTUNITY_ANALYSIS_PROMPT(summary, segments) + (userPrompt ? `\nMerchant Query: ${userPrompt}` : '') }
          ],
          response_format: { type: 'json_object' }
        });

        const content = response.choices[0]?.message?.content;
        const rawOpps = parsed.opportunities || [];
        const savedOpps = [];
        for (const opp of rawOpps) {
          const existing = await Opportunity.findOne({ type: opp.type, status: { $in: ['identified', 'approved'] } });
          if (existing) {
            Object.assign(existing, opp);
            await existing.save();
            savedOpps.push(existing);
          } else {
            const created = await Opportunity.create(opp);
            savedOpps.push(created);
          }
        }

        // Record agent action
        await AgentAction.create({
          actionType: 'analyze_data',
          input: { userPrompt, summary },
          output: { opportunitiesFound: savedOpps.length, opportunities: savedOpps },
          status: 'completed',
          aiProvider: 'openai'
        });

        return {
          provider: 'openai',
          mode: aiMode,
          opportunities: savedOpps,
          durationMs: Date.now() - startTime
        };
      } catch (err) {
        logger.warn(`OpenAI analysis error (${err.message}). Falling back to Demo AI engine.`);
      }
    }

    // 2. Demo AI Engine fallback analyzing live DB
    const demoResult = await DemoAIEngine.analyzeMerchantData(userPrompt);

    // Save or update opportunities in DB for persistence
    const savedOpportunities = [];
    for (const opp of demoResult.opportunities) {
      const existing = await Opportunity.findOne({ type: opp.type, status: { $in: ['identified', 'approved'] } });
      if (existing) {
        Object.assign(existing, opp);
        await existing.save();
        savedOpportunities.push(existing);
      } else {
        const created = await Opportunity.create(opp);
        savedOpportunities.push(created);
      }
    }

    // Record agent action in DB
    await AgentAction.create({
      actionType: 'analyze_data',
      input: { userPrompt, trigger: 'merchant_request' },
      output: { opportunitiesFound: savedOpportunities.length, summary: demoResult.summary },
      status: 'completed',
      aiProvider: 'demo'
    });

    return {
      provider: 'demo',
      mode: 'AI Mode: Demo',
      summary: demoResult.summary,
      opportunities: savedOpportunities,
      metricsSnapshot: demoResult.metricsSnapshot,
      intent: demoResult.intent,
      answer: demoResult.answer,
      durationMs: Date.now() - startTime
    };
  }

  /**
   * Recommend and generate personalized campaign copy for a given opportunity
   */
  static async generateRecommendation(opportunityId) {
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      throw new Error(`Opportunity not found with ID: ${opportunityId}`);
    }

    const aiMode = this.getAIMode();

    if (openaiClient && config.aiProvider === 'openai') {
      try {
        const response = await openaiClient.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: CAMPAIGN_GENERATION_PROMPT(opportunity) }
          ],
          response_format: { type: 'json_object' }
        });

        const copy = JSON.parse(response.choices[0]?.message?.content || '{}');

        await AgentAction.create({
          opportunityId: opportunity._id,
          actionType: 'generate_recommendation',
          input: { opportunityId: opportunity._id, type: opportunity.type },
          output: copy,
          status: 'completed',
          aiProvider: 'openai'
        });

        return {
          provider: 'openai',
          mode: aiMode,
          opportunity,
          campaignCopy: copy
        };
      } catch (err) {
        logger.warn(`OpenAI recommendation error: ${err.message}. Using demo generator.`);
      }
    }

    const demoCopy = await DemoAIEngine.generateCampaignContent(opportunity);

    await AgentAction.create({
      opportunityId: opportunity._id,
      actionType: 'generate_recommendation',
      input: { opportunityId: opportunity._id, type: opportunity.type },
      output: demoCopy,
      status: 'completed',
      aiProvider: 'demo'
    });

    return {
      provider: 'demo',
      mode: 'AI Mode: Demo',
      opportunity,
      campaignCopy: demoCopy
    };
  }
}
