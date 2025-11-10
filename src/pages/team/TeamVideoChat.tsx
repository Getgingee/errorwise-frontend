import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface JitsiMeetExternalAPI {
  dispose: () => void;
  executeCommand: (command: string, ...args: any[]) => void;
  addEventListener: (event: string, handler: Function) => void;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: new (domain: string, options: any) => JitsiMeetExternalAPI;
  }
}

const TeamVideoChat = () => {
  const { teamId, sessionId } = useParams<{ teamId: string; sessionId: string }>();
  const navigate = useNavigate();
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApi = useRef<JitsiMeetExternalAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionInfo, setSessionInfo] = useState<any>(null);

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
      try {
        setLoading(true);
        setError(null);

        // Get session info from backend
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please login to join video chat');
        }

        // Start video chat session
        const response = await axios.post(
          `${API_URL}/teams/${teamId}/video/start`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const session = response.data.session;
        setSessionInfo(session);

        // Load Jitsi script
        await loadJitsiScript();

        // Initialize Jitsi Meet
        if (jitsiContainerRef.current && window.JitsiMeetExternalAPI) {
          const domain = 'meet.jit.si';
          const options = {
            roomName: session.room_id,
            width: '100%',
            height: '100%',
            parentNode: jitsiContainerRef.current,
            configOverwrite: {
              startWithAudioMuted: false,
              startWithVideoMuted: false,
              enableWelcomePage: false,
              prejoinPageEnabled: false,
              disableDeepLinking: true,
            },
            interfaceConfigOverwrite: {
              SHOW_JITSI_WATERMARK: false,
              SHOW_WATERMARK_FOR_GUESTS: false,
              SHOW_BRAND_WATERMARK: false,
              TOOLBAR_BUTTONS: [
                'microphone',
                'camera',
                'closedcaptions',
                'desktop',
                'fullscreen',
                'fodeviceselection',
                'hangup',
                'profile',
                'chat',
                'recording',
                'livestreaming',
                'etherpad',
                'sharedvideo',
                'settings',
                'raisehand',
                'videoquality',
                'filmstrip',
                'feedback',
                'stats',
                'shortcuts',
                'tileview',
                'download',
                'help',
                'mute-everyone',
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

          // Auto-end session after 30 minutes
          const expiresAt = new Date(session.expires_at).getTime();
          const now = Date.now();
          const timeUntilExpiry = expiresAt - now;

          if (timeUntilExpiry > 0) {
            setTimeout(() => {
              alert('Video session has expired (30 minute limit)');
              handleEndCall();
            }, timeUntilExpiry);
          }
        }
      } catch (err: any) {
        console.error('Video chat initialization error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to initialize video chat');
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
  }, [teamId, sessionId]);

  const handleEndCall = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token && teamId) {
        await axios.post(
          `${API_URL}/teams/${teamId}/video/end`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error('Error ending video call:', err);
    } finally {
      navigate(`/dashboard`);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Video Chat Error</h2>
          <p className="text-gray-600 mb-6 text-center">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-white text-lg">Connecting to video chat...</p>
            {sessionInfo && (
              <p className="text-gray-400 text-sm mt-2">
                Session expires in 30 minutes
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Session info bar */}
      {sessionInfo && !loading && (
        <div className="absolute top-0 left-0 right-0 bg-gray-800 text-white px-4 py-2 flex justify-between items-center z-20">
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              <span className="font-semibold">Team Video Chat</span>
            </span>
            <span className="text-xs text-gray-400">
              Started by {sessionInfo.started_by}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-400">
              30 minute session
            </span>
            <button
              onClick={handleEndCall}
              className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-sm font-medium transition-colors"
            >
              Leave Call
            </button>
          </div>
        </div>
      )}

      {/* Jitsi container */}
      <div 
        ref={jitsiContainerRef} 
        className="w-full h-full"
        style={{ paddingTop: sessionInfo && !loading ? '48px' : '0' }}
      />
    </div>
  );
};

export default TeamVideoChat;
