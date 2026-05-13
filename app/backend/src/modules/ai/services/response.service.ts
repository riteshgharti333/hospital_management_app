// src/modules/ai/services/response.service.ts

import { Intent } from './intent.service';

export class ResponseService {
  
  format(rawData: any, intent: Intent): string {
    
    switch (intent.intent) {
      case 'GET_TOTAL_ADMISSIONS':
        return this.formatAdmissionResponse(rawData, intent);
      
      default:
        return 'I\'m sorry, I couldn\'t quite understand that. Could you please rephrase your question?';
    }
  }
  
  private formatAdmissionResponse(data: any, intent: Intent): string {
    const count = data.total;
    const date = data.date;
    
    // Generate human-like response
    const responses = this.generateAdmissionResponses(count, date);
    
    // Pick random response for variety
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  private generateAdmissionResponses(count: number, date: string): string[] {
    const dateText = date === 'today' ? 'today' : 
                     date === 'yesterday' ? 'yesterday' : date;
    
    return [
      // Natural responses
      `📊 I can see that ${count} patients have been admitted ${dateText}.`,
      `As of now, we've had ${count} admissions ${dateText}.`,
      `There are ${count} patients who got admitted ${dateText}.`,
      `Looking at the records, ${count} patients were admitted ${dateText}.`,
      
      // Detailed responses
      `According to our system, a total of ${count} patient admissions have been recorded ${dateText}.`,
      `I checked the records for you. ${count} patients have been admitted ${dateText} so far.`,
      `The admission count for ${dateText} stands at ${count} patients.`,
      
      // Friendly responses
      `Great question! We've admitted ${count} patients ${dateText}.`,
      `Here's what I found: ${count} admissions ${dateText}.`,
      `Sure! ${count} patients have been admitted ${dateText}.`,
      
      // Time-sensitive (only if date is today)
      ...(date === 'today' ? [
        `So far today, ${count} patients have been admitted. This number might change as the day progresses.`,
        `Today's admission count is currently at ${count} patients.`,
        `As of this moment, we've recorded ${count} admissions today.`
      ] : []),
      
      // Contextual responses
      `I hope this helps! The total admissions for ${dateText} is ${count} patients.`,
      `Here's your answer: ${count} patients admitted ${dateText}. Is there anything else you'd like to know?`,
      `📋 Admission summary for ${dateText}: ${count} patients. Let me know if you need more details!`,
    ];
  }
}