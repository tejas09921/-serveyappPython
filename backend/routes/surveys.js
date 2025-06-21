import express from 'express';
import { Survey } from '../models/Survey.js';
import { Question } from '../models/Question.js';

const router = express.Router();

// Get all surveys
router.get('/', async (req, res) => {
  try {
    const surveys = await Survey.findAll();
    res.json(surveys);
  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).json({ error: 'Failed to fetch surveys' });
  }
});

// Get survey by ID
router.get('/:id', async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }
    res.json(survey);
  } catch (error) {
    console.error('Error fetching survey:', error);
    res.status(500).json({ error: 'Failed to fetch survey' });
  }
});

// Get survey with questions
router.get('/:id/full', async (req, res) => {
  try {
    const survey = await Survey.findByIdWithQuestions(req.params.id);
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }
    res.json(survey);
  } catch (error) {
    console.error('Error fetching survey with questions:', error);
    res.status(500).json({ error: 'Failed to fetch survey' });
  }
});

// Create new survey
router.post('/', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const survey = await Survey.create({ title, description, status });
    res.status(201).json(survey);
  } catch (error) {
    console.error('Error creating survey:', error);
    res.status(500).json({ error: 'Failed to create survey' });
  }
});

// Update survey
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const survey = await Survey.update(req.params.id, { title, description, status });
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }
    
    res.json(survey);
  } catch (error) {
    console.error('Error updating survey:', error);
    res.status(500).json({ error: 'Failed to update survey' });
  }
});

// Update survey status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['draft', 'live'].includes(status)) {
      return res.status(400).json({ error: 'Status must be either "draft" or "live"' });
    }
    
    const survey = await Survey.updateStatus(req.params.id, status);
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }
    
    res.json(survey);
  } catch (error) {
    console.error('Error updating survey status:', error);
    res.status(500).json({ error: 'Failed to update survey status' });
  }
});

// Delete survey
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Survey.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Survey not found' });
    }
    
    res.json({ message: 'Survey deleted successfully' });
  } catch (error) {
    console.error('Error deleting survey:', error);
    res.status(500).json({ error: 'Failed to delete survey' });
  }
});

// Get questions for a survey
router.get('/:id/questions', async (req, res) => {
  try {
    const questions = await Question.findBySurveyId(req.params.id);
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

export default router;