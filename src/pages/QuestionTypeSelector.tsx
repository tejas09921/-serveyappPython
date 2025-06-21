import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, FileText, CheckSquare, Type } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Input, Textarea } from '../components/ui/Input';

interface QuestionPreview {
  type: 'single_choice' | 'multiple_choice' | 'text';
  question: string;
  options: string[];
}

export function QuestionTypeSelector() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<'single_choice' | 'multiple_choice' | 'text' | null>(null);
  const [preview, setPreview] = useState<QuestionPreview>({
    type: 'single_choice',
    question: 'How satisfied are you with our service?',
    options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']
  });

  const questionTypes = [
    {
      type: 'single_choice' as const,
      title: 'Single Choice',
      description: 'Users can select only one option from multiple choices',
      icon: <div className="w-4 h-4 rounded-full border-2 border-blue-500 bg-white" />,
      color: 'from-blue-100 to-blue-200',
      iconColor: 'text-blue-600',
      example: {
        question: 'How satisfied are you with our service?',
        options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']
      }
    },
    {
      type: 'multiple_choice' as const,
      title: 'Multiple Choice',
      description: 'Users can select up to 2 options from multiple choices',
      icon: <div className="w-4 h-4 rounded border-2 border-green-500 bg-white" />,
      color: 'from-green-100 to-green-200',
      iconColor: 'text-green-600',
      example: {
        question: 'Which features do you use most? (Select up to 2)',
        options: ['Dashboard', 'Reports', 'Settings', 'Support', 'Analytics']
      }
    },
    {
      type: 'text' as const,
      title: 'Text Input',
      description: 'Users can enter free-form text responses',
      icon: <div className="w-4 h-4 border-2 border-purple-500 bg-white rounded" />,
      color: 'from-purple-100 to-purple-200',
      iconColor: 'text-purple-600',
      example: {
        question: 'What improvements would you like to see?',
        options: []
      }
    }
  ];

  const handleTypeSelect = (type: 'single_choice' | 'multiple_choice' | 'text') => {
    setSelectedType(type);
    const selectedTypeData = questionTypes.find(t => t.type === type);
    if (selectedTypeData) {
      setPreview({
        type,
        question: selectedTypeData.example.question,
        options: selectedTypeData.example.options
      });
    }
  };

  const handleCreateQuestion = () => {
    // Navigate to admin with the selected question type
    navigate('/admin', { state: { selectedQuestionType: selectedType } });
  };

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
                Question Types
              </h1>
              <p className="text-gray-600 mt-1">Choose the perfect question type for your survey</p>
            </div>
          </div>
          <Link to="/admin">
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Survey</span>
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Question Types */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Available Question Types</h2>
            
            {questionTypes.map((type) => (
              <Card 
                key={type.type}
                hover
                className={`cursor-pointer transition-all duration-300 ${
                  selectedType === type.type 
                    ? 'ring-2 ring-blue-500 shadow-xl' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => handleTypeSelect(type.type)}
              >
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${type.color} rounded-lg flex items-center justify-center`}>
                      {React.cloneElement(type.icon, { className: `w-6 h-6 ${type.iconColor}` })}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {type.title}
                      </h3>
                      <p className="text-gray-600">
                        {type.description}
                      </p>
                    </div>
                    {selectedType === type.type && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Example:</p>
                    <p className="text-gray-900 mb-3">{type.example.question}</p>
                    {type.example.options.length > 0 && (
                      <div className="space-y-2">
                        {type.example.options.slice(0, 3).map((option, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            {type.type === 'single_choice' ? (
                              <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                            ) : (
                              <div className="w-4 h-4 rounded border-2 border-gray-300" />
                            )}
                            <span className="text-sm text-gray-700">{option}</span>
                          </div>
                        ))}
                        {type.example.options.length > 3 && (
                          <p className="text-xs text-gray-500 ml-6">
                            +{type.example.options.length - 3} more options
                          </p>
                        )}
                      </div>
                    )}
                    {type.type === 'text' && (
                      <div className="border-2 border-dashed border-gray-300 rounded p-3">
                        <p className="text-sm text-gray-500 italic">User can type their response here...</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Live Preview */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Live Preview</h2>
            
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Question Preview</h3>
                <p className="text-gray-600">See how your question will appear to survey takers</p>
              </CardHeader>
              <CardContent>
                {selectedType ? (
                  <div className="space-y-4">
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">
                        1. {preview.question}
                      </h4>
                      
                      {preview.type === 'text' ? (
                        <Textarea
                          placeholder="Enter your answer..."
                          rows={4}
                          disabled
                          className="bg-gray-50"
                        />
                      ) : (
                        <div className="space-y-3">
                          {preview.options.map((option, idx) => (
                            <label key={idx} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                              <input
                                type={preview.type === 'single_choice' ? 'radio' : 'checkbox'}
                                name="preview"
                                disabled
                                className="w-4 h-4 text-blue-600 border-gray-300"
                              />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                          {preview.type === 'multiple_choice' && (
                            <p className="text-sm text-blue-600 mt-2">
                              Maximum of 2 selections allowed
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button onClick={handleCreateQuestion} className="flex-1">
                        Create Question with This Type
                      </Button>
                      <Link to="/admin">
                        <Button variant="secondary">
                          Go to Admin Panel
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-500 mb-2">
                      Select a Question Type
                    </h4>
                    <p className="text-gray-400">
                      Choose a question type from the left to see a live preview
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Best Practices */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Best Practices</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-600">
                      <strong>Single Choice:</strong> Perfect for ratings, preferences, or when you need one definitive answer
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-600">
                      <strong>Multiple Choice:</strong> Great for feature preferences or when users might have multiple valid answers
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-600">
                      <strong>Text Input:</strong> Ideal for detailed feedback, suggestions, or when you need qualitative data
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}