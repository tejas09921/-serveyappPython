import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Users, FileText, TrendingUp, Eye } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { surveyApi, responseApi } from '../lib/api';
import { Survey } from '../types/survey';

interface AnalyticsData {
  totalSurveys: number;
  totalResponses: number;
  liveSurveys: number;
  draftSurveys: number;
  recentResponses: Array<{
    survey_title: string;
    response_count: number;
    last_response: string;
  }>;
}

export function AnalyticsPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalSurveys: 0,
    totalResponses: 0,
    liveSurveys: 0,
    draftSurveys: 0,
    recentResponses: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null);
  const [surveyResponses, setSurveyResponses] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch all surveys
      const surveysData = await surveyApi.getAll();
      setSurveys(surveysData || []);

      // Calculate analytics
      const totalSurveys = surveysData?.length || 0;
      const liveSurveys = surveysData?.filter(s => s.status === 'live').length || 0;
      const draftSurveys = surveysData?.filter(s => s.status === 'draft').length || 0;

      // Fetch responses for each survey to get total count
      let totalResponses = 0;
      const recentResponses = [];

      for (const survey of surveysData || []) {
        try {
          const responses = await responseApi.getBySurvey(survey.id);
          const responseCount = responses?.length || 0;
          totalResponses += responseCount;

          if (responseCount > 0) {
            recentResponses.push({
              survey_title: survey.title,
              response_count: responseCount,
              last_response: responses[0]?.submitted_at || survey.updated_at
            });
          }
        } catch (error) {
          // Skip if no responses or error fetching
          console.log(`No responses for survey ${survey.id}`);
        }
      }

      setAnalytics({
        totalSurveys,
        totalResponses,
        liveSurveys,
        draftSurveys,
        recentResponses: recentResponses
          .sort((a, b) => new Date(b.last_response).getTime() - new Date(a.last_response).getTime())
          .slice(0, 5)
      });

    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSurveyResponses = async (surveyId: string) => {
    try {
      const responses = await responseApi.getBySurvey(surveyId);
      setSurveyResponses(responses || []);
      setSelectedSurvey(surveyId);
    } catch (error) {
      console.error('Failed to fetch survey responses:', error);
      setSurveyResponses([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="secondary" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Real-time Analytics
              </h1>
              <p className="text-gray-600 mt-1">Track survey performance and response data</p>
            </div>
          </div>
          <Link to="/admin">
            <Button className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Admin Panel</span>
            </Button>
          </Link>
        </div>

        {/* Analytics Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card hover>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {analytics.totalSurveys}
              </h3>
              <p className="text-gray-600 text-sm">Total Surveys</p>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {analytics.totalResponses}
              </h3>
              <p className="text-gray-600 text-sm">Total Responses</p>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {analytics.liveSurveys}
              </h3>
              <p className="text-gray-600 text-sm">Live Surveys</p>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {analytics.draftSurveys}
              </h3>
              <p className="text-gray-600 text-sm">Draft Surveys</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Survey Performance */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Survey Performance</h2>
              <p className="text-gray-600">Response activity across your surveys</p>
            </CardHeader>
            <CardContent>
              {analytics.recentResponses.length > 0 ? (
                <div className="space-y-4">
                  {analytics.recentResponses.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.survey_title}</h4>
                        <p className="text-sm text-gray-600">
                          Last response: {new Date(item.last_response).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-blue-600">
                          {item.response_count}
                        </p>
                        <p className="text-xs text-gray-500">responses</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No responses yet</p>
                  <p className="text-sm text-gray-400">Responses will appear here once surveys are submitted</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Survey List with Response Counts */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">All Surveys</h2>
              <p className="text-gray-600">Click to view detailed responses</p>
            </CardHeader>
            <CardContent>
              {surveys.length > 0 ? (
                <div className="space-y-3">
                  {surveys.map((survey) => (
                    <div
                      key={survey.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => fetchSurveyResponses(survey.id)}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{survey.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            survey.status === 'live' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {survey.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            Created {new Date(survey.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No surveys created yet</p>
                  <Link to="/admin">
                    <Button className="mt-4">Create Your First Survey</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Survey Response Details */}
        {selectedSurvey && (
          <Card className="mt-8">
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">
                Response Details: {surveys.find(s => s.id === selectedSurvey)?.title}
              </h2>
              <p className="text-gray-600">Individual response data</p>
            </CardHeader>
            <CardContent>
              {surveyResponses.length > 0 ? (
                <div className="space-y-4">
                  {surveyResponses.map((response, index) => (
                    <div key={response.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Response #{index + 1}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(response.submitted_at).toLocaleString()}
                        </span>
                      </div>
                      {response.answers && response.answers.length > 0 && (
                        <div className="space-y-2">
                          {response.answers.map((answer: any, answerIndex: number) => (
                            <div key={answerIndex} className="bg-gray-50 rounded p-3">
                              <p className="text-sm font-medium text-gray-700 mb-1">
                                Question {answerIndex + 1}
                              </p>
                              {answer.answer_text ? (
                                <p className="text-gray-900">{answer.answer_text}</p>
                              ) : (
                                <p className="text-gray-900">
                                  Selected options: {JSON.parse(answer.selected_options || '[]').length} option(s)
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No responses for this survey yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}