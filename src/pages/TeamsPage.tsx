import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Users, UserPlus, Trash2, Crown } from 'lucide-react';
import toast from 'react-hot-toast';

interface TeamMember {
  id: string;
  email: string;
  role: string;
  joinedAt: string;
}

interface Team {
  id: string;
  name: string;
  ownerId: string;
  members: TeamMember[];
  createdAt: string;
}

const TeamsPage: React.FC = () => {
  const [team, setTeam] = useState<Team | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://errorwise-backend-production.up.railway.app/api/teams', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setTeam(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch team:', error);
      toast.error('Failed to load team');
      setLoading(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://errorwise-backend-production.up.railway.app/api/teams/members', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: inviteEmail })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Team member invited successfully!');
        setInviteEmail('');
        fetchTeam();
      } else {
        toast.error(data.error || 'Failed to invite member');
      }
    } catch (error) {
      console.error('Failed to invite member:', error);
      toast.error('Failed to invite member');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://errorwise-backend-production.up.railway.app/api/teams/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Member removed successfully');
        fetchTeam();
      } else {
        toast.error(data.error || 'Failed to remove member');
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
      toast.error('Failed to remove member');
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Team Management</h1>
          </div>

          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : team ? (
            <div className="space-y-6">
              {/* Team Info */}
              <div className="glass-card border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Team: {team.name}</h2>
                <p className="text-gray-400">Created: {new Date(team.createdAt).toLocaleDateString()}</p>
              </div>

              {/* Invite Member */}
              <div className="glass-card border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Invite Team Member
                </h3>
                <form onSubmit={handleInviteMember} className="flex gap-4">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="member@example.com"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all"
                  >
                    Invite
                  </button>
                </form>
              </div>

              {/* Team Members */}
              <div className="glass-card border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Team Members ({team.members.length})</h3>
                <div className="space-y-3">
                  {team.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {member.role === 'owner' && <Crown className="w-5 h-5 text-yellow-400" />}
                        <div>
                          <p className="text-white font-medium">{member.email}</p>
                          <p className="text-gray-400 text-sm">
                            {member.role === 'owner' ? 'Owner' : 'Member'} • Joined {new Date(member.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {member.role !== 'owner' && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Remove member"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card border border-white/10 rounded-2xl p-8 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Team Found</h3>
              <p className="text-gray-400 mb-6">
                Upgrade to a Team plan to create and manage your team
              </p>
              <a
                href="/subscription"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all"
              >
                Upgrade to Team Plan
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
