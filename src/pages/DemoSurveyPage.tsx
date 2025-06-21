import React from 'react';
import { SurveyTaker } from '../components/survey/SurveyTaker';

export function DemoSurveyPage() {
  // Using the demo survey ID from the seed data
  const demoSurveyId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

  return <SurveyTaker surveyId={demoSurveyId} />;
}