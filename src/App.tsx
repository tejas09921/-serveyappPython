import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AdminPage } from './pages/AdminPage';
import { SurveyPage } from './pages/SurveyPage';
import { QuestionTypeSelector } from './pages/QuestionTypeSelector';
import { DemoSurveyPage } from './pages/DemoSurveyPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { PrivacyPage } from './pages/PrivacyPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/add-question" element={<QuestionTypeSelector />} />
        <Route path="/admin/analytics" element={<AnalyticsPage />} />
        <Route path="/survey/demo" element={<DemoSurveyPage />} />
        <Route path="/survey/:id" element={<SurveyPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;