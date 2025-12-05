import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { videoMeetingService, Meeting } from '../../services/videoMeetingService';

interface JitsiMeetExternalAPI {
  dispose: () => void;
  executeCommand: (command: string, ...args: unknown[]) => void;
  addEventListener: (event: string, handler: (...args: unknown[]) => void) => void;
  getParticipantsInfo: () => Array<{ displayName: string; participantId: string }>;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: new (domain: string, options: object) => JitsiMeetExternalAPI;
  }
}

// Icons
const NoteIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const ErrorIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SendIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

// Side Panel Component
interface SidePanelProps {
  meeting: Meeting;
  teamId: string;
  onClose: () => void;
  activeTab: 'notes' | 'chat' | 'errors';
  setActiveTab: (tab: 'notes' | 'chat' | 'errors') => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ meeting, teamId, onClose, activeTab, setActiveTab }) => {
  const [noteContent, setNoteContent] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [notes, setNotes] = useState(meeting.meeting_notes || []);
  const [sending, setSending] = useState(false);

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;
    setSending(true);
    try {
      await videoMeetingService.updateNotes(teamId, meeting.id, noteContent);
      setNotes(prev => [...prev, {
        id: Date.now().toString(),
        user_id: '',
        username: localStorage.getItem('username') || 'You',
        content: noteContent,
        timestamp: new Date().toISOString(),
        type: 'note' as const
      }]);
      setNoteContent('');
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setSending(false);
    }
  };

  const handleSendChat = async () => {
    if (!chatMessage.trim()) return;
    setSending(true);
    try {
      await videoMeetingService.addChatMessage(teamId, meeting.id, chatMessage);
      setNotes(prev => [...prev, {
        id: Date.now().toString(),
        user_id: '',
        username: localStorage.getItem('username') || 'You',
        content: chatMessage,
        timestamp: new Date().toISOString(),
        type: 'chat' as const
      }]);
      setChatMessage('');
    } catch (err) {
      console.error('Failed to send chat:', err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const filteredNotes = notes.filter(n => 
    activeTab === 'notes' ? n.type === 'note' : n.type === 'chat'
  );

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('notes')}
            className={`p-2 rounded-lg transition-colors ${activeTab === 'notes' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            title="Meeting Notes"
          >
            <NoteIcon />
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`p-2 rounded-lg transition-colors ${activeTab === 'chat' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            title="Chat"
          >
            <ChatIcon />
          </button>
          <button
            onClick={() => setActiveTab('errors')}
            className={`p-2 rounded-lg transition-colors ${activeTab === 'errors' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            title="Error Context"
          >
            <ErrorIcon />
          </button>
        </div>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <XIcon />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'errors' ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4">
              Share error context from your ErrorWise analyses to discuss with your team.
            </p>
            {meeting.error_context && meeting.error_context.length > 0 ? (
              meeting.error_context.map((err, idx) => (
                <div key={idx} className="bg-red-50 rounded-lg p-3 border border-red-100">
                  <p className="text-sm font-mono text-red-800 break-all">{err.error_message}</p>
                  <p className="text-xs text-red-500 mt-2">Added by {err.added_by}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm text-center py-8">No errors shared yet</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotes.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">
                No {activeTab === 'notes' ? 'notes' : 'messages'} yet
              </p>
            ) : (
              filteredNotes.map((note) => (
                <div key={note.id} className={`p-3 rounded-lg ${activeTab === 'notes' ? 'bg-yellow-50 border border-yellow-100' : 'bg-gray-50'}`}>
                  <p className="text-sm text-gray-800">{note.content}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{note.username}</span>
                    <span className="text-xs text-gray-400">{formatTime(note.timestamp)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Input */}
      {activeTab !== 'errors' && (
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={activeTab === 'notes' ? noteContent : chatMessage}
              onChange={(e) => activeTab === 'notes' ? setNoteContent(e.target.value) : setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (activeTab === 'notes' ? handleAddNote() : handleSendChat())}
              placeholder={activeTab === 'notes' ? 'Add a note...' : 'Type a message...'}
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              onClick={activeTab === 'notes' ? handleAddNote : handleSendChat}
              disabled={sending || (activeTab === 'notes' ? !noteContent.trim() : !chatMessage.trim())}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const TeamVideoChat = () => {
  const { teamId, sessionId } = useParams<{ teamId: string; sessionId: string }>();
  const navigate = useNavigate();
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApi = useRef<JitsiMeetExternalAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'chat' | 'errors'>('notes');
  const [participants, setParticipants] = useState<string[]>([]);

  const handleEndCall = useCallback(async () => {
    try {
      if (teamId && sessionId) {
        await videoMeetingService.endMeeting(teamId, sessionId);
      }
    } catch (err) {
      console.error('Error ending video call:', err);
    } finally {
      navigate('/dashboard');
    }
  }, [teamId, sessionId, navigate]);

  useEffect(() => {
    // Load Jitsi Meet API script
    const loadJitsiScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Jitsi Meet API'));
        document.body.appendChild(script);
      });
    };

    // Initialize video chat
    const initializeVideoChat = async () => {
      if (!teamId || !sessionId) return;
      
      try {
        setLoading(true);
        setError(null);

        // Join the meeting through our backend
        const { meeting: meetingData, jitsiUrl } = await videoMeetingService.joinMeeting(teamId, sessionId);
        setMeeting(meetingData);

        // Load Jitsi script
        await loadJitsiScript();

        // Initialize Jitsi Meet
        if (jitsiContainerRef.current && window.JitsiMeetExternalAPI) {
          const domain = 'meet.jit.si';
          const options = {
            roomName: meetingData.room_id,
            width: '100%',
            height: '100%',
            parentNode: jitsiContainerRef.current,
            configOverwrite: {
              startWithAudioMuted: meetingData.settings?.mute_on_join || false,
              startWithVideoMuted: false,
              enableWelcomePage: false,
              prejoinPageEnabled: false,
              disableDeepLinking: true,
            },
            interfaceConfigOverwrite: {
              SHOW_JITSI_WATERMARK: false,
              SHOW_WATERMARK_FOR_GUESTS: false,
              SHOW_BRAND_WATERMARK: false,
              DEFAULT_BACKGROUND: '#1a1a2e',
              TOOLBAR_BUTTONS: [
                'microphone',
                'camera',
                'desktop',
                'fullscreen',
                'hangup',
                'chat',
                'raisehand',
                'tileview',
                'settings',
                'videoquality',
                'filmstrip',
                'participants-pane',
                'security',
              ],
            },
            userInfo: {
              displayName: localStorage.getItem('username') || 'Team Member',
            },
          };

          jitsiApi.current = new window.JitsiMeetExternalAPI(domain, options);

          // Event listeners
          jitsiApi.current.addEventListener('videoConferenceJoined', () => {
            console.log('Video conference joined');
            setLoading(false);
          });

          jitsiApi.current.addEventListener('videoConferenceLeft', () => {
            console.log('Video conference left');
            handleEndCall();
          });

          jitsiApi.current.addEventListener('readyToClose', () => {
            handleEndCall();
          });

          jitsiApi.current.addEventListener('participantJoined', () => {
            if (jitsiApi.current) {
              const info = jitsiApi.current.getParticipantsInfo();
              setParticipants(info.map(p => p.displayName));
            }
          });

          jitsiApi.current.addEventListener('participantLeft', () => {
            if (jitsiApi.current) {
              const info = jitsiApi.current.getParticipantsInfo();
              setParticipants(info.map(p => p.displayName));
            }
          });

          // Auto-end session after duration
          if (meetingData.duration_minutes) {
            const durationMs = meetingData.duration_minutes * 60 * 1000;
            const startedAt = meetingData.started_at ? new Date(meetingData.started_at).getTime() : Date.now();
            const elapsed = Date.now() - startedAt;
            const remaining = durationMs - elapsed;

            if (remaining > 0) {
              setTimeout(() => {
                alert(`Meeting duration (${meetingData.duration_minutes} minutes) has ended`);
                handleEndCall();
              }, remaining);
            }
          }
        }
      } catch (err: unknown) {
        console.error('Video chat initialization error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize video chat';
        setError(errorMessage);
        setLoading(false);
      }
    };

    initializeVideoChat();

    // Cleanup
    return () => {
      if (jitsiApi.current) {
        jitsiApi.current.dispose();
        jitsiApi.current = null;
      }
    };
  }, [teamId, sessionId, handleEndCall]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ErrorIcon />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Video Chat Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 flex">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-white text-lg">Connecting to video chat...</p>
              {meeting && (
                <p className="text-gray-400 text-sm mt-2">{meeting.title}</p>
              )}
            </div>
          </div>
        )}

        {/* Top Bar */}
        {meeting && !loading && (
          <div className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center z-20">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="font-semibold">{meeting.title}</h1>
                {meeting.description && (
                  <p className="text-sm text-gray-400">{meeting.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {participants.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <UsersIcon />
                  <span>{participants.length} participants</span>
                </div>
              )}
              <button
                onClick={() => setShowSidePanel(!showSidePanel)}
                className={`p-2 rounded-lg transition-colors ${showSidePanel ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                title="Toggle side panel"
              >
                <NoteIcon />
              </button>
              <button
                onClick={handleEndCall}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Leave Call
              </button>
            </div>
          </div>
        )}

        {/* Jitsi Container */}
        <div
          ref={jitsiContainerRef}
          className="flex-1"
        />
      </div>

      {/* Side Panel */}
      {showSidePanel && meeting && teamId && (
        <SidePanel
          meeting={meeting}
          teamId={teamId}
          onClose={() => setShowSidePanel(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
};

export default TeamVideoChat;
