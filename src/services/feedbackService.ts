import { API_ENDPOINTS } from '../config/api';

export interface FeedbackData {
  type: 'up' | 'down';
  comment?: string;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  feedback: {
    type: string;
    comment: string | null;
    timestamp: string;
  };
}

/**
 * Submit feedback for an analysis result
 * B2: Consistent, Structured Result Card - Feedback Controls
 */
export async function submitResultFeedback(
  queryId: string,
  feedback: FeedbackData,
  token: string
): Promise<FeedbackResponse> {
  const response = await fetch(`${API_ENDPOINTS.errors.base}/${queryId}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(feedback),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to submit feedback');
  }

  return response.json();
}
