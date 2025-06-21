export interface Survey {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'live';
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  survey_id: string;
  question_text: string;
  question_type: 'single_choice' | 'multiple_choice' | 'text';
  order_index: number;
  created_at: string;
  question_options?: QuestionOption[];
}

export interface QuestionOption {
  id: string;
  question_id: string;
  option_text: string;
  order_index: number;
}

export interface SurveyResponse {
  id?: string;
  survey_id: string;
  submitted_at?: string;
  session_id?: string;
}

export interface Answer {
  id?: string;
  response_id: string;
  question_id: string;
  answer_text?: string;
  selected_options?: string[];
}

export interface SurveyWithQuestions extends Survey {
  questions: Question[];
}

export interface CreateSurveyData {
  title: string;
  description: string;
  status?: 'draft' | 'live';
}

export interface CreateQuestionData {
  survey_id: string;
  question_text: string;
  question_type: 'single_choice' | 'multiple_choice' | 'text';
  order_index: number;
  options?: string[];
}