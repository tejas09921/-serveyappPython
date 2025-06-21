import React, { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Input, Textarea } from '../ui/Input';
import { Question, CreateQuestionData } from '../../types/survey';

interface QuestionBuilderProps {
  surveyId: string;
  questions: Question[];
  onAddQuestion: (data: CreateQuestionData) => Promise<void>;
  onDeleteQuestion: (questionId: string) => Promise<void>;
}

interface NewQuestion {
  question_text: string;
  question_type: 'single_choice' | 'multiple_choice' | 'text';
  options: string[];
  required: boolean;
  char_limit: number | '';
}

const QUESTION_TYPES = [
  {
    key: 'single_choice',
    label: 'Single Choice',
    description: 'User can select only one option',
    icon: <span className="inline-block w-4 h-4 rounded-full border-2 border-blue-500 bg-white" />,
  },
  {
    key: 'multiple_choice',
    label: 'Multiple Choice',
    description: 'User can select up to 2 options',
    icon: <span className="inline-block w-4 h-4 rounded border-2 border-green-500 bg-white" />,
  },
  {
    key: 'text',
    label: 'Text Input',
    description: 'User can enter text',
    icon: <span className="inline-block w-4 h-4 border-2 border-purple-500 bg-white" />,
  },
];

export function QuestionBuilder({ surveyId, questions, onAddQuestion, onDeleteQuestion }: QuestionBuilderProps) {
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState<NewQuestion>({
    question_text: '',
    question_type: 'single_choice',
    options: ['', ''],
    required: false,
    char_limit: '',
  });
  const [loading, setLoading] = useState(false);

  const handleAddOption = () => {
    setNewQuestion(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const handleRemoveOption = (index: number) => {
    if (newQuestion.options.length > 2) {
      setNewQuestion(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    setNewQuestion(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const handleTypeSelect = (type: 'single_choice' | 'multiple_choice' | 'text') => {
    setNewQuestion(prev => ({
      ...prev,
      question_type: type,
      options: type === 'text' ? [] : ['', ''],
    }));
  };

  const handleSubmit = async (e: React.FormEvent, draft = false) => {
    e.preventDefault();
    if (!newQuestion.question_text.trim()) return;
    try {
      setLoading(true);
      const filteredOptions = newQuestion.question_type === 'text'
        ? []
        : newQuestion.options.filter(opt => opt.trim());
      await onAddQuestion({
        survey_id: surveyId,
        question_text: newQuestion.question_text,
        question_type: newQuestion.question_type,
        order_index: questions.length + 1,
        options: filteredOptions,
        required: newQuestion.required,
        char_limit: newQuestion.char_limit || undefined,
        draft,
      });
      setNewQuestion({
        question_text: '',
        question_type: 'single_choice',
        options: ['', ''],
        required: false,
        char_limit: '',
      });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add question:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Questions</h2>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Question</span>
        </Button>
      </div>

      {/* Existing Questions */}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id} className="group">
            <CardHeader className="flex-row items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    question.question_type === 'text' 
                      ? 'bg-purple-100 text-purple-800'
                      : question.question_type === 'single_choice'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {question.question_type.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-2">
                  {question.question_text}
                </h3>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDeleteQuestion(question.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            {question.question_options && question.question_options.length > 0 && (
              <CardContent>
                <div className="space-y-2">
                  {question.question_options
                    .sort((a, b) => a.order_index - b.order_index)
                    .map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <div className={`w-4 h-4 border-2 border-gray-300 ${
                        question.question_type === 'single_choice' ? 'rounded-full' : 'rounded'
                      }`} />
                      <span className="text-gray-700">{option.option_text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Add Question Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Add New Question</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
              <Textarea
                label="Question Text"
                value={newQuestion.question_text}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, question_text: e.target.value }))}
                placeholder="Enter your question"
                required
                rows={2}
              />

              {/* Question Type Selection */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Type
                </label>
                <div className="flex space-x-4">
                  {QUESTION_TYPES.map((type) => (
                    <button
                      type="button"
                      key={type.key}
                      className={`flex flex-col items-center px-4 py-2 border rounded-lg shadow-sm focus:outline-none transition-all ${
                        newQuestion.question_type === type.key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => handleTypeSelect(type.key as 'single_choice' | 'multiple_choice' | 'text')}
                    >
                      {type.icon}
                      <span className="font-medium mt-1">{type.label}</span>
                      <span className="text-xs text-gray-500">{type.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Options UI */}
              {newQuestion.question_type !== 'text' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      Answer Options
                    </label>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleAddOption}
                    >
                      Add Option
                    </Button>
                  </div>
                  {newQuestion.options.map((option, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Input
                        value={option}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Option ${idx + 1}`}
                        required
                        className="flex-1"
                      />
                      {newQuestion.options.length > 2 && (
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveOption(idx)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {newQuestion.question_type === 'multiple_choice' && (
                    <div className="text-xs text-gray-500">Max 2 selections allowed</div>
                  )}
                </div>
              )}

              {/* Validation Rules */}
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newQuestion.required}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, required: e.target.checked }))}
                  />
                  <span>Required</span>
                </label>
                <label className="flex items-center space-x-2">
                  <span>Character Limit:</span>
                  <Input
                    type="number"
                    min={1}
                    value={newQuestion.char_limit}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, char_limit: e.target.value ? parseInt(e.target.value) : '' }))}
                    className="w-20"
                  />
                </label>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" loading={loading}>
                  Save Question
                </Button>
                <Button type="button" variant="secondary" onClick={(e) => handleSubmit(e as any, true)}>
                  Save as Draft
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}