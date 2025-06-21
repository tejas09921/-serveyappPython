import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Database, Eye, UserCheck, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
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
                Privacy & Security
              </h1>
              <p className="text-gray-600 mt-1">How we protect your data and ensure privacy</p>
            </div>
          </div>
        </div>

        {/* Security Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Security First</h2>
                <p className="text-gray-600">Built with enterprise-grade security and privacy protection</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">End-to-End Encryption</h3>
                <p className="text-sm text-gray-600">All data is encrypted in transit and at rest using industry-standard AES-256 encryption</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure Database</h3>
                <p className="text-sm text-gray-600">MySQL database with connection pooling, parameterized queries, and regular security updates</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Anonymous Responses</h3>
                <p className="text-sm text-gray-600">Survey responses are completely anonymous with no personal identification required</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Eye className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Data Privacy</h3>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>No personal information is collected or stored</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Anonymous session IDs are used for response tracking</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>IP addresses are not logged or stored</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>No cookies or tracking pixels are used</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Data is never shared with third parties</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Database className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900">Technical Security</h3>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                  <span>SQL injection prevention with parameterized queries</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                  <span>CORS protection for cross-origin requests</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Input validation and sanitization</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Regular security audits and updates</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Secure connection pooling and rate limiting</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Data Handling */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">Data Handling Policy</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-gray-600">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">What We Collect</h4>
              <p className="mb-4">
                We only collect the survey responses you voluntarily provide. This includes:
              </p>
              <ul className="list-disc list-inside mb-6 space-y-1">
                <li>Your answers to survey questions</li>
                <li>Anonymous session identifiers for response grouping</li>
                <li>Timestamps of when responses were submitted</li>
              </ul>

              <h4 className="text-lg font-semibold text-gray-900 mb-3">What We Don't Collect</h4>
              <ul className="list-disc list-inside mb-6 space-y-1">
                <li>Personal identifying information (name, email, phone)</li>
                <li>IP addresses or location data</li>
                <li>Browser fingerprints or device information</li>
                <li>Behavioral tracking or analytics data</li>
              </ul>

              <h4 className="text-lg font-semibold text-gray-900 mb-3">Data Retention</h4>
              <p className="mb-4">
                Survey responses are retained only as long as necessary for the survey's purpose. 
                Survey creators can delete their surveys and all associated responses at any time.
              </p>

              <h4 className="text-lg font-semibold text-gray-900 mb-3">Your Rights</h4>
              <p>
                Since responses are anonymous, we cannot identify or modify individual responses. 
                However, you have the right to know how your data is handled and can contact 
                survey creators directly if you have concerns about specific surveys.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions About Privacy?</h3>
            <p className="text-gray-600 mb-4">
              We're committed to transparency and protecting your privacy. If you have any questions 
              about our security practices or data handling, please don't hesitate to reach out.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link to="/admin">
                <Button variant="secondary">Admin Panel</Button>
              </Link>
              <Link to="/">
                <Button>Back to Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}