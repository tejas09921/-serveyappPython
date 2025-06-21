import express from 'express';
import { Response } from '../models/Response.js';

const router = express.Router();

// Submit survey response
router.post('/', async (req, res) => {
  try {
    const { survey_id, answers, session_id } = req.body;
    
    if (!survey_id || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'survey_id and answers array are required' });
    }
    
    const response = await Response.create({
      survey_id,
      answers,
      session_id: session_id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error submitting response:', error);
    res.status(500).json({ error: 'Failed to submit response' });
  }
});

// Get responses for a survey (admin only)
router.get('/survey/:surveyId', async (req, res) => {
  try {
    const responses = await Response.findBySurveyId(req.params.surveyId);
    res.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

export default router;