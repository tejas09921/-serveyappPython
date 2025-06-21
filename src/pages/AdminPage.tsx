import React, { useState } from 'react';
import { SurveyList } from '../components/admin/SurveyList';
import { SurveyForm } from '../components/admin/SurveyForm';
import { QuestionBuilder } from '../components/admin/QuestionBuilder';
import { Button } from '../components/ui/Button';
import { useSurveys } from '../hooks/useSurveys';
import { useQuestions } from '../hooks/useQuestions';
import { Survey, CreateSurveyData } from '../types/survey';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export function AdminPage() {
  const { surveys, loading, createSurvey, updateSurveyStatus, deleteSurvey } = useSurveys();
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [showSurveyForm, setShowSurveyForm] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);
  
  const { 
    questions, 
    loading: questionsLoading, 
    createQuestion, 
    deleteQuestion 
  } = useQuestions(selectedSurvey?.id || '');

  const handleCreateSurvey = () => {
    setEditingSurvey(null);
    setShowSurveyForm(true);
  };

  const handleEditSurvey = (survey: Survey) => {
    setEditingSurvey(survey);
    setShowSurveyForm(true);
  };

  const handleViewSurvey = (survey: Survey) => {
    if (survey.status === 'live') {
      window.open(`/survey/${survey.id}`, '_blank');
    }
  };

  const handleSurveySubmit = async (data: CreateSurveyData) => {
    if (editingSurvey) {
      // For now, we'll just create a new survey since update isn't implemented
      // In a real app, you'd implement update functionality
      await createSurvey(data);
    } else {
      await createSurvey(data);
    }
  };

  const handleDeleteSurvey = async (id: string) => {
    if (confirm('Are you sure you want to delete this survey? This action cannot be undone.')) {
      await deleteSurvey(id);
      if (selectedSurvey?.id === id) {
        setSelectedSurvey(null);
      }
    }
  };

  const handleToggleStatus = async (id: string, status: 'draft' | 'live') => {
    await updateSurveyStatus(id, status);
  };

  if (selectedSurvey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="secondary"
                onClick={() => setSelectedSurvey(null)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Surveys</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedSurvey.title}
                </h1>
                <p className="text-gray-600">Manage questions and settings</p>
              </div>
            </div>
            {selectedSurvey.status === 'live' && (
              <Button
                onClick={() => handleViewSurvey(selectedSurvey)}
                className="flex items-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Live Survey</span>
              </Button>
            )}
          </div>

          <QuestionBuilder
            surveyId={selectedSurvey.id}
            questions={questions}
            onAddQuestion={createQuestion}
            onDeleteQuestion={deleteQuestion}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <SurveyList
          surveys={surveys}
          onCreateSurvey={handleCreateSurvey}
          onEditSurvey={(survey) => setSelectedSurvey(survey)}
          onViewSurvey={handleViewSurvey}
          onToggleStatus={handleToggleStatus}
          onDeleteSurvey={handleDeleteSurvey}
          loading={loading}
        />

        <SurveyForm
          isOpen={showSurveyForm}
          onClose={() => setShowSurveyForm(false)}
          onSubmit={handleSurveySubmit}
          survey={editingSurvey}
        />
      </div>
    </div>
  );
}