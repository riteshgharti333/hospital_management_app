// src/modules/ai/services/intent.service.ts

import { normalizeQuery } from '../utils/normalizeQuery';

export interface Intent {
  intent: string;
  confidence: number;
  filters: {
    date?: string;
  };
  originalQuery: string;
}

export class IntentService {
  
  parse(userQuery: string): Intent {
    const query = normalizeQuery(userQuery);
    
    console.log(`[IntentParser] Processing: "${query}"`);
    
    // Check for total admission queries
    if (this.isAdmissionQuery(query)) {
      return {
        intent: 'GET_TOTAL_ADMISSIONS',
        confidence: 0.95,
        filters: {
          date: this.extractDate(query)
        },
        originalQuery: userQuery
      };
    }
    
    // Unknown query
    return {
      intent: 'UNKNOWN',
      confidence: 0,
      filters: {},
      originalQuery: userQuery
    };
  }
  
  private isAdmissionQuery(query: string): boolean {
    const admissionWords = [
      'admission',
      'admissions', 
      'admitted',
      'admit',
      'patient',
      'patients',
      'total patient',
      'total patients',
      'how many patient',
      'how many patients',
      'number of patient',
      'number of patients',
      'count of patient',
      'count of patients'
    ];
    
    return admissionWords.some(word => query.includes(word));
  }
  
  private extractDate(query: string): string {
    if (query.includes('today')) return 'today';
    if (query.includes('yesterday')) return 'yesterday';
    if (query.includes('this week')) return 'this_week';
    if (query.includes('this month')) return 'this_month';
    if (query.includes('last week')) return 'last_week';
    if (query.includes('last month')) return 'last_month';
    
    return 'today'; // default
  }
}