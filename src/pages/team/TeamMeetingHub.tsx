import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { videoMeetingService, Meeting, ScheduleMeetingData } from '../../services/videoMeetingService';

// Icons
const VideoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Schedule Meeting Modal
interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (data: ScheduleMeetingData) => Promise<void>;
}

const ScheduleMeetingModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, onSchedule }) => {
  const [title, setTitle] = useState('Team Meeting');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [waitingRoom, setWaitingRoom] = useState(false);
  const [muteOnJoin, setMuteOnJoin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const scheduledStart = scheduledDate && scheduledTime 
        ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
        : undefined;
      
      await onSchedule({
        title,
        description: description || undefined,
        scheduledStart,
        durationMinutes: duration,
        settings: {
          waitingRoom,
          muteOnJoin,
          allowScreenShare: true,
          recordMeeting: false
        }
      });
      onClose();
      // Reset form
      setTitle('Team Meeting');
      setDescription('');
      setScheduledDate('');
      setScheduledTime('');
      setDuration(30);
    } catch (err) {
      console.error('Failed to schedule meeting:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Schedule Meeting</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="What will be discussed in this meeting?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={waitingRoom}
                onChange={(e) => setWaitingRoom(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enable waiting room</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={muteOnJoin}
                onChange={(e) => setMuteOnJoin(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Mute participants on join</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Scheduling...' : 'Schedule Meeting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Meeting Card Component
interface MeetingCardProps {
  meeting: Meeting;
  onJoin: (meetingId: string) => void;
  onCancel: (meetingId: string) => void;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, onJoin, onCancel }) => {
  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    ended: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
          {meeting.description && (
            <p className="text-sm text-gray-500 mt-1">{meeting.description}</p>
          )}
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[meeting.status]}`}>
          {meeting.status}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        {meeting.scheduled_start && (
          <div className="flex items-center gap-1">
            <CalendarIcon />
            <span>{formatDate(meeting.scheduled_start)}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <ClockIcon />
          <span>{meeting.duration_minutes} min</span>
        </div>
        {meeting.participants && meeting.participants.length > 0 && (
          <div className="flex items-center gap-1">
            <UsersIcon />
            <span>{meeting.participants.length}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {(meeting.status === 'scheduled' || meeting.status === 'active') && (
          <button
            onClick={() => onJoin(meeting.id)}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <VideoIcon />
            {meeting.status === 'active' ? 'Join Now' : 'Start Meeting'}
          </button>
        )}
        {meeting.status === 'scheduled' && (
          <button
            onClick={() => onCancel(meeting.id)}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            Cancel
          </button>
        )}
        {meeting.status === 'ended' && meeting.meeting_notes && meeting.meeting_notes.length > 0 && (
          <span className="text-sm text-gray-500">
            {meeting.meeting_notes.length} notes saved
          </span>
        )}
      </div>
    </div>
  );
};

// Main Team Meeting Hub Component
const TeamMeetingHub = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const fetchMeetings = useCallback(async () => {
    if (!teamId) return;
    try {
      setLoading(true);
      const status = filter !== 'all' ? filter : undefined;
      const data = await videoMeetingService.getMeetings(teamId, status);
      setMeetings(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch meetings:', err);
      setError(err.response?.data?.message || 'Failed to load meetings');
    } finally {
      setLoading(false);
    }
  }, [teamId, filter]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const handleStartInstant = async () => {
    if (!teamId) return;
    try {
      const meeting = await videoMeetingService.startInstantMeeting(teamId, 'Quick Team Call');
      navigate(`/team/${teamId}/video/${meeting.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to start meeting');
    }
  };

  const handleScheduleMeeting = async (data: ScheduleMeetingData) => {
    if (!teamId) return;
    await videoMeetingService.scheduleMeeting(teamId, data);
    fetchMeetings();
  };

  const handleJoinMeeting = async (meetingId: string) => {
    if (!teamId) return;
    navigate(`/team/${teamId}/video/${meetingId}`);
  };

  const handleCancelMeeting = async (meetingId: string) => {
    if (!teamId) return;
    if (!confirm('Are you sure you want to cancel this meeting?')) return;
    try {
      await videoMeetingService.cancelMeeting(teamId, meetingId);
      fetchMeetings();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel meeting');
    }
  };

  const upcomingMeetings = meetings.filter(m => m.status === 'scheduled' || m.status === 'active');
  const pastMeetings = meetings.filter(m => m.status === 'ended' || m.status === 'cancelled');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Meetings</h1>
            <p className="text-gray-600 mt-1">Schedule and join video meetings with your team</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleStartInstant}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <VideoIcon />
              Start Instant Meeting
            </button>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <PlusIcon />
              Schedule Meeting
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {['all', 'scheduled', 'active', 'ended'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                filter === f
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : meetings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="text-gray-400 mb-4">
              <VideoIcon />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings yet</h3>
            <p className="text-gray-500 mb-6">Start an instant meeting or schedule one for later</p>
            <button
              onClick={handleStartInstant}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Start Your First Meeting
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Upcoming Meetings */}
            {upcomingMeetings.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming & Active</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingMeetings.map((meeting) => (
                    <MeetingCard
                      key={meeting.id}
                      meeting={meeting}
                      onJoin={handleJoinMeeting}
                      onCancel={handleCancelMeeting}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Past Meetings */}
            {pastMeetings.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Meetings</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pastMeetings.map((meeting) => (
                    <MeetingCard
                      key={meeting.id}
                      meeting={meeting}
                      onJoin={handleJoinMeeting}
                      onCancel={handleCancelMeeting}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ScheduleMeetingModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={handleScheduleMeeting}
      />
    </div>
  );
};

export default TeamMeetingHub;
