import express from 'express';
import { Question } from '../models/Question.js';

const router = express.Router();

// Create new question
router.post('/', async (req, res) => {
  try {
    const { survey_id, question_text, question_type, order_index, options } = req.body;
    
    if (!survey_id || !question_text || !question_type) {
      return res.status(400).json({ error: 'survey_id, question_text, and question_type are required' });
    }
    
    const question = await Question.create({
      survey_id,
      question_text,
      question_type,
      order_index: order_index || 0,
      options: options || []
    });
    
    res.status(201).json(question);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

// Delete question
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Question.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

export default router;