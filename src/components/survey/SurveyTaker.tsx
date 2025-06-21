import React, { useState, useEffect } from 'react';
import { surveyApi, responseApi } from '../../lib/api';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Input, Textarea } from '../ui/Input';
import { Survey, Question } from '../../types/survey';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface SurveyTakerProps {
  surveyId: string;
}

export function SurveyTaker({ surveyId }: SurveyTakerProps) {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSurveyData();
  }, [surveyId]);

  const fetchSurveyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const surveyData = await surveyApi.getWithQuestions(surveyId);
      
      if (surveyData.status !== 'live') {
        throw new Error('Survey not found or not published');
      }
      
      setSurvey(surveyData);
      setQuestions(surveyData.questions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load survey');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: any, questionType: string) => {
    if (questionType === 'multiple_choice') {
      const currentSelections = answers[questionId] || [];
      let newSelections;
      
      if (currentSelections.includes(value)) {
        // Remove selection
        newSelections = currentSelections.filter((id: string) => id !== value);
      } else {
        // Add selection (max 2)
        if (currentSelections.length >= 2) {
          return; // Don't add more than 2 selections
        }
        newSelections = [...currentSelections, value];
      }
      
      setAnswers(prev => ({ ...prev, [questionId]: newSelections }));
    } else {
      setAnswers(prev => ({ ...prev, [questionId]: value }));
    }
    
    // Clear validation error for this question
    if (validationErrors[questionId]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateAnswers = () => {
    const errors: Record<string, string> = {};
    
    questions.forEach(question => {
      const answer = answers[question.id];
      
      if (question.question_type === 'text') {
        if (!answer || !answer.trim()) {
          errors[question.id] = 'This question is required';
        }
      } else if (question.question_type === 'single_choice') {
        if (!answer) {
          errors[question.id] = 'Please select an option';
        }
      } else if (question.question_type === 'multiple_choice') {
        if (!answer || answer.length === 0) {
          errors[question.id] = 'Please select at least one option';
        }
      }
    });
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateAnswers();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setSubmitting(true);
      
      const answersData = questions.map(question => ({
        question_id: question.id,
        answer_text: question.question_type === 'text' ? answers[question.id] : null,
        selected_options: question.question_type !== 'text' 
          ? Array.isArray(answers[question.id]) 
            ? answers[question.id] 
            : [answers[question.id]]
          : []
      }));

      await responseApi.submit({
        survey_id: surveyId,
        answers: answersData,
        session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit survey');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading survey...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Survey Not Available</h2>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
            <p className="text-gray-600 text-lg mb-6">
              Your response has been submitted successfully.
            </p>
            <p className="text-sm text-gray-500">
              We appreciate you taking the time to complete our survey.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="mb-8">
          <CardHeader>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {survey?.title}
            </h1>
            {survey?.description && (
              <p className="text-gray-600 text-lg mt-2">{survey.description}</p>
            )}
          </CardHeader>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question, index) => (
            <Card key={question.id}>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {index + 1}. {question.question_text}
                  </h3>
                  {question.question_type === 'multiple_choice' && (
                    <p className="text-sm text-gray-600">Select up to 2 options</p>
                  )}
                </div>

                {question.question_type === 'text' ? (
                  <Textarea
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value, question.question_type)}
                    placeholder="Enter your answer..."
                    rows={4}
                    error={validationErrors[question.id]}
                  />
                ) : (
                  <div className="space-y-3">
                    {question.question_options
                      ?.sort((a, b) => a.order_index - b.order_index)
                      .map((option) => (
                      <label key={option.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type={question.question_type === 'single_choice' ? 'radio' : 'checkbox'}
                          name={question.id}
                          value={option.id}
                          checked={
                            question.question_type === 'single_choice'
                              ? answers[question.id] === option.id
                              : answers[question.id]?.includes(option.id) || false
                          }
                          onChange={(e) => {
                            if (question.question_type === 'multiple_choice') {
                              const currentSelections = answers[question.id] || [];
                              if (currentSelections.length >= 2 && !currentSelections.includes(option.id)) {
                                return; // Don't allow more than 2 selections
                              }
                            }
                            handleAnswerChange(question.id, option.id, question.question_type);
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-gray-700">{option.option_text}</span>
                      </label>
                    ))}
                    {validationErrors[question.id] && (
                      <p className="text-sm text-red-600 mt-2">{validationErrors[question.id]}</p>
                    )}
                    {question.question_type === 'multiple_choice' && 
                     answers[question.id]?.length >= 2 && (
                      <p className="text-sm text-blue-600 mt-2">
                        Maximum of 2 selections reached
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardContent className="p-6">
              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full py-3 text-lg"
                size="lg"
              >
                {submitting ? 'Submitting...' : 'Submit Survey'}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}