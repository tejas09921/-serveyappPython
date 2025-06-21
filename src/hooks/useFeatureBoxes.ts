import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function useFeatureBoxes() {
  const navigate = useNavigate();
  const [showPrivacy, setShowPrivacy] = useState(false);

  const features = [
    {
      title: 'Multiple Question Types',
      description: 'Single choice, multiple choice, and text input questions',
      onClick: () => navigate('/admin/add-question'),
    },
    {
      title: 'Anonymous Responses',
      description: 'Collect honest feedback with anonymous survey submissions',
      onClick: () => navigate('/survey/demo'),
    },
    {
      title: 'Real-time Analytics',
      description: 'Track responses and analyze results as they come in',
      onClick: () => navigate('/admin/analytics'),
    },
    {
      title: 'Secure & Reliable',
      description: 'Built with security and data privacy as top priorities',
      onClick: () => setShowPrivacy(true),
      isPrivacy: true,
      showPrivacy,
      setShowPrivacy,
    },
  ];

  return features;
} 