import { useState, useEffect } from 'react';
import { surveyApi, questionApi } from '../lib/api';
import { Question, CreateQuestionData } from '../types/survey';

export function useQuestions(surveyId: string) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (surveyId) {
      fetchQuestions();
    }
  }, [surveyId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await surveyApi.getQuestions(surveyId);
      setQuestions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const createQuestion = async (questionData: CreateQuestionData) => {
    try {
      const question = await questionApi.create(questionData);
      setQuestions(prev => [...prev, question]);
      return question;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create question');
    }
  };

  const deleteQuestion = async (questionId: string) => {
    try {
      await questionApi.delete(questionId);
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete question');
    }
  };

  return {
    questions,
    loading,
    error,
    fetchQuestions,
    createQuestion,
    deleteQuestion
  };
}