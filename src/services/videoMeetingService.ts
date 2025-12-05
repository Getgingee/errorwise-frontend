import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export interface Meeting {
  id: string;
  team_id: string;
  title: string;
  description?: string;
  scheduled_start?: string;
  duration_minutes: number;
  meeting_type: 'instant' | 'scheduled';
  status: 'scheduled' | 'active' | 'ended' | 'cancelled';
  room_id: string;
  invite_code: string;
  created_by: string;
  started_at?: string;
  ended_at?: string;
  settings: {
    waiting_room: boolean;
    allow_screen_share: boolean;
    record_meeting: boolean;
    mute_on_join: boolean;
  };
  meeting_notes: Array<{
    id: string;
    user_id: string;
    username: string;
    content: string;
    timestamp: string;
    type: 'note' | 'chat';
  }>;
  error_context?: Array<{
    error_id: string;
    error_message: string;
    added_by: string;
    added_at: string;
  }>;
  participants: Array<{
    user_id: string;
    username: string;
    joined_at: string;
    left_at?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleMeetingData {
  title: string;
  description?: string;
  scheduledStart?: string;
  durationMinutes?: number;
  settings?: {
    waitingRoom?: boolean;
    allowScreenShare?: boolean;
    recordMeeting?: boolean;
    muteOnJoin?: boolean;
  };
}

export const videoMeetingService = {
  // Schedule a new meeting
  async scheduleMeeting(teamId: string, data: ScheduleMeetingData): Promise<Meeting> {
    const response = await axios.post(
      `${API_URL}/teams/${teamId}/meetings/schedule`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data.meeting;
  },

  // Start an instant meeting
  async startInstantMeeting(teamId: string, title?: string): Promise<Meeting> {
    const response = await axios.post(
      `${API_URL}/teams/${teamId}/meetings/instant`,
      { title },
      { headers: getAuthHeaders() }
    );
    return response.data.meeting;
  },

  // Get all meetings for a team
  async getMeetings(teamId: string, status?: string): Promise<Meeting[]> {
    const params = status ? { status } : {};
    const response = await axios.get(
      `${API_URL}/teams/${teamId}/meetings`,
      { headers: getAuthHeaders(), params }
    );
    return response.data.meetings;
  },

  // Get upcoming meeting
  async getUpcomingMeeting(teamId: string): Promise<Meeting | null> {
    const response = await axios.get(
      `${API_URL}/teams/${teamId}/meetings/upcoming`,
      { headers: getAuthHeaders() }
    );
    return response.data.meeting;
  },

  // Join a meeting
  async joinMeeting(teamId: string, meetingId: string): Promise<{ meeting: Meeting; jitsiUrl: string }> {
    const response = await axios.post(
      `${API_URL}/teams/${teamId}/meetings/${meetingId}/join`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // End a meeting
  async endMeeting(teamId: string, meetingId: string): Promise<void> {
    await axios.post(
      `${API_URL}/teams/${teamId}/meetings/${meetingId}/end`,
      {},
      { headers: getAuthHeaders() }
    );
  },

  // Update meeting notes
  async updateNotes(teamId: string, meetingId: string, content: string): Promise<void> {
    await axios.put(
      `${API_URL}/teams/${teamId}/meetings/${meetingId}/notes`,
      { content },
      { headers: getAuthHeaders() }
    );
  },

  // Add error context to meeting
  async addErrorContext(teamId: string, meetingId: string, errorId: string, errorMessage: string): Promise<void> {
    await axios.post(
      `${API_URL}/teams/${teamId}/meetings/${meetingId}/error-context`,
      { errorId, errorMessage },
      { headers: getAuthHeaders() }
    );
  },

  // Add chat message
  async addChatMessage(teamId: string, meetingId: string, content: string): Promise<void> {
    await axios.post(
      `${API_URL}/teams/${teamId}/meetings/${meetingId}/chat`,
      { content },
      { headers: getAuthHeaders() }
    );
  },

  // Cancel a meeting
  async cancelMeeting(teamId: string, meetingId: string): Promise<void> {
    await axios.delete(
      `${API_URL}/teams/${teamId}/meetings/${meetingId}`,
      { headers: getAuthHeaders() }
    );
  }
};

export default videoMeetingService;
