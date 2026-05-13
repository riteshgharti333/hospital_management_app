// src/modules/ai/services/ai.service.ts

import { IntentService, Intent } from './intent.service';
import { ToolService } from './tool.service';
import { ResponseService } from './response.service';

export class AIService {
  private intentService: IntentService;
  private toolService: ToolService;
  private responseService: ResponseService;
  private conversationHistory: Array<{query: string, response: string}> = [];
  
  constructor() {
    this.intentService = new IntentService();
    this.toolService = new ToolService();
    this.responseService = new ResponseService();
  }
  
  async processQuery(userQuery: string): Promise<any> {
    console.log(`🤔 User asked: "${userQuery}"`);
    
    // Step 1: Understand intent
    const intent = this.intentService.parse(userQuery);
    console.log(`🎯 Intent detected: ${intent.intent}`);
    
    // Step 2: Get data from database
    const data = await this.toolService.execute(intent);
    console.log(`📊 Raw data:`, data);
    
    // Step 3: Format human-like response
    const message = this.responseService.format(data, intent);
    console.log(`💬 Response: ${message}`);
    
    // Save to history
    this.conversationHistory.push({
      query: userQuery,
      response: message
    });
    
    return {
      response: message,
      intent: intent.intent,
      confidence: intent.confidence,
      timestamp: new Date().toISOString(),
      suggestions: this.generateSuggestions(intent)
    };
  }
  
  private generateSuggestions(intent: Intent): string[] {
    const suggestions: string[] = [
      "Show me today's admissions by department",
      "How many patients were admitted yesterday?",
      "What's the admission count for this week?",
      "Show me emergency admissions today"
    ];
    
    return suggestions.slice(0, 3); // Return 3 suggestions
  }
}