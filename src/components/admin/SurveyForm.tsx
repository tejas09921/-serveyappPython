import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Survey, CreateSurveyData } from '../../types/survey';

interface SurveyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSurveyData) => Promise<void>;
  survey?: Survey | null;
}

export function SurveyForm({ isOpen, onClose, onSubmit, survey }: SurveyFormProps) {
  const [formData, setFormData] = useState<CreateSurveyData>({
    title: survey?.title || '',
    description: survey?.description || '',
    status: survey?.status || 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      await onSubmit(formData);
      onClose();
      setFormData({ title: '', description: '', status: 'draft' });
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to save survey' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({ title: '', description: '', status: 'draft' });
    setErrors({});
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={survey ? 'Edit Survey' : 'Create New Survey'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Survey Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          placeholder="Enter survey title"
          required
        />

        <Textarea
          label="Description (Optional)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter survey description"
          rows={3}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'live' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="draft">Draft</option>
            <option value="live">Live</option>
          </select>
        </div>

        {errors.submit && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {errors.submit}
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Saving...' : survey ? 'Update Survey' : 'Create Survey'}
          </Button>
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}