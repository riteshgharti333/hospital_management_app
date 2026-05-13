// src/modules/ai/controllers/ai.controller.ts

import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';

const aiService = new AIService();

export class AIController {
  
  async handleQuery(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.body;
      
      if (!query) {
        res.status(400).json({ error: 'Please provide a query' });
        return;
      }
      
      const result = await aiService.processQuery(query);
      
      res.json({
        success: true,
        data: result
      });
      
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: 'Something went wrong' 
      });
    }
  }
}