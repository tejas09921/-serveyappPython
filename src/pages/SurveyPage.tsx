import React from 'react';
import { useParams } from 'react-router-dom';
import { SurveyTaker } from '../components/survey/SurveyTaker';

export function SurveyPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Survey Not Found</h1>
          <p className="text-gray-600">The survey ID is missing from the URL.</p>
        </div>
      </div>
    );
  }

  return <SurveyTaker surveyId={id} />;
}