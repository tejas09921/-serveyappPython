import { useState, useEffect } from 'react';
import { surveyApi } from '../lib/api';
import { Survey, CreateSurveyData } from '../types/survey';

export function useSurveys() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await surveyApi.getAll();
      setSurveys(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch surveys');
    } finally {
      setLoading(false);
    }
  };

  const createSurvey = async (surveyData: CreateSurveyData) => {
    try {
      const data = await surveyApi.create(surveyData);
      setSurveys(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create survey');
    }
  };

  const updateSurveyStatus = async (id: string, status: 'draft' | 'live') => {
    try {
      const data = await surveyApi.updateStatus(id, status);
      setSurveys(prev => prev.map(survey => 
        survey.id === id ? { ...survey, status } : survey
      ));
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update survey');
    }
  };

  const deleteSurvey = async (id: string) => {
    try {
      await surveyApi.delete(id);
      setSurveys(prev => prev.filter(survey => survey.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete survey');
    }
  };

  return {
    surveys,
    loading,
    error,
    fetchSurveys,
    createSurvey,
    updateSurveyStatus,
    deleteSurvey
  };
}