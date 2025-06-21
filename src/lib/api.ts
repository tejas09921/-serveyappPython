const API_BASE_URL = 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ApiError(errorData.error || `HTTP ${response.status}`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0);
  }
}

// Survey API functions
export const surveyApi = {
  // Get all surveys
  getAll: () => apiRequest('/surveys'),
  
  // Get survey by ID
  getById: (id: string) => apiRequest(`/surveys/${id}`),
  
  // Get survey with questions
  getWithQuestions: (id: string) => apiRequest(`/surveys/${id}/full`),
  
  // Create new survey
  create: (data: { title: string; description: string; status?: string }) =>
    apiRequest('/surveys', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Update survey
  update: (id: string, data: { title: string; description: string; status?: string }) =>
    apiRequest(`/surveys/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Update survey status
  updateStatus: (id: string, status: 'draft' | 'live') =>
    apiRequest(`/surveys/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  
  // Delete survey
  delete: (id: string) =>
    apiRequest(`/surveys/${id}`, {
      method: 'DELETE',
    }),
  
  // Get survey questions
  getQuestions: (id: string) => apiRequest(`/surveys/${id}/questions`),
};

// Question API functions
export const questionApi = {
  // Create new question
  create: (data: {
    survey_id: string;
    question_text: string;
    question_type: 'single_choice' | 'multiple_choice' | 'text';
    order_index: number;
    options?: string[];
  }) =>
    apiRequest('/questions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Delete question
  delete: (id: string) =>
    apiRequest(`/questions/${id}`, {
      method: 'DELETE',
    }),
};

// Response API functions
export const responseApi = {
  // Submit survey response
  submit: (data: {
    survey_id: string;
    answers: Array<{
      question_id: string;
      answer_text?: string;
      selected_options?: string[];
    }>;
    session_id?: string;
  }) =>
    apiRequest('/responses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Get responses for a survey (admin)
  getBySurvey: (surveyId: string) => apiRequest(`/responses/survey/${surveyId}`),
};

export { ApiError };