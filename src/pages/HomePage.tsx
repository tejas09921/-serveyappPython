import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { FileText, Users, BarChart3, Shield } from 'lucide-react';
import { Modal } from '../components/ui/Modal';

export function HomePage() {
  const navigate = useNavigate();
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Survey Platform
              </h1>
            </div>
            <Link to="/admin">
              <Button className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Admin Panel</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Create Beautiful
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {' '}Surveys
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Build engaging surveys with multiple question types, collect anonymous responses, 
            and gain valuable insights from your audience.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link to="/admin">
              <Button size="lg" className="px-8 py-4">
                Get Started
              </Button>
            </Link>
            <Button variant="secondary" size="lg" className="px-8 py-4">
              View Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card hover className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Multiple Question Types
              </h3>
              <p className="text-gray-600 text-sm">
                Single choice, multiple choice, and text input questions
              </p>
            </CardContent>
          </Card>

          <Card hover className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Anonymous Responses
              </h3>
              <p className="text-gray-600 text-sm">
                Collect honest feedback with anonymous survey submissions
              </p>
            </CardContent>
          </Card>

          <Card hover className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Real-time Analytics
              </h3>
              <p className="text-gray-600 text-sm">
                Track responses and analyze results as they come in
              </p>
            </CardContent>
          </Card>

          <Card hover className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Secure & Reliable
              </h3>
              <p className="text-gray-600 text-sm">
                Built with security and data privacy as top priorities
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Survey Section */}
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Try Our Demo Survey
            </h3>
            <p className="text-gray-600 mb-6">
              Experience how surveys work from a participant's perspective with our sample customer satisfaction survey.
            </p>
            <Link to="/survey/f47ac10b-58cc-4372-a567-0e02b2c3d479">
              <Button size="lg" variant="secondary">
                Take Demo Survey
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-white/50 backdrop-blur-sm border-t border-white/20 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Survey Platform. Built with React, TypeScript, and Supabase.</p>
          </div>
        </div>
      </div>

      {/* Privacy Modal */}
      <Modal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} title="Privacy & Security">
        <p className="mb-2">We use industry-standard encryption and secure database practices to protect your data. All survey responses can be stored anonymously. Read our full privacy policy for more details.</p>
        <Button onClick={() => setShowPrivacy(false)}>Close</Button>
      </Modal>
    </div>
  );
}