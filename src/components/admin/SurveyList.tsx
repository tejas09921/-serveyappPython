import React from 'react';
import { Plus, Eye, Edit, Trash2, Globe, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Survey } from '../../types/survey';

interface SurveyListProps {
  surveys: Survey[];
  onCreateSurvey: () => void;
  onEditSurvey: (survey: Survey) => void;
  onViewSurvey: (survey: Survey) => void;
  onToggleStatus: (id: string, status: 'draft' | 'live') => void;
  onDeleteSurvey: (id: string) => void;
  loading: boolean;
}

export function SurveyList({
  surveys,
  onCreateSurvey,
  onEditSurvey,
  onViewSurvey,
  onToggleStatus,
  onDeleteSurvey,
  loading
}: SurveyListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Survey Management
          </h1>
          <p className="text-gray-600 mt-2">Create and manage your surveys</p>
        </div>
        <Button onClick={onCreateSurvey} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Survey</span>
        </Button>
      </div>

      {surveys.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first survey</p>
            <Button onClick={onCreateSurvey}>Create Survey</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {surveys.map((survey) => (
            <Card key={survey.id} hover className="group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {survey.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{survey.description || 'No description'}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        survey.status === 'live' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {survey.status === 'live' ? (
                          <>
                            <Globe className="w-3 h-3 mr-1" />
                            Live
                          </>
                        ) : (
                          <>
                            <FileText className="w-3 h-3 mr-1" />
                            Draft
                          </>
                        )}
                      </span>
                      <span className="text-sm text-gray-500">
                        Created {new Date(survey.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onViewSurvey(survey)}
                      className="flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEditSurvey(survey)}
                      className="flex items-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDeleteSurvey(survey.id)}
                      className="flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Last updated {new Date(survey.updated_at).toLocaleDateString()}
                  </div>
                  <Button
                    variant={survey.status === 'live' ? 'secondary' : 'success'}
                    size="sm"
                    onClick={() => onToggleStatus(survey.id, survey.status === 'live' ? 'draft' : 'live')}
                  >
                    {survey.status === 'live' ? 'Make Draft' : 'Publish'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}