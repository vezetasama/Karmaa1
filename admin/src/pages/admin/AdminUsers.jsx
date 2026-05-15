import { useState, useEffect } from 'react';
import { Shield, User, RefreshCw, Eye, X } from 'lucide-react';
import { getAdminUsers, getAdminUserCredentials } from '../../services/api';
import { PageLoader } from '../../components/Loader';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingUser, setViewingUser] = useState(null);
  const [credentialLoading, setCredentialLoading] = useState(false);
  const [credentialError, setCredentialError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try { const res = await getAdminUsers(); setUsers(res.data.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCredentialModal = async (userId) => {
    setCredentialLoading(true);
    setCredentialError('');
    try {
      const res = await getAdminUserCredentials(userId);
      setViewingUser(res.data.data);
    } catch (err) {
      setCredentialError(err?.response?.data?.message || 'Failed to load credentials');
    } finally {
      setCredentialLoading(false);
    }
  };

  const closeCredentialModal = () => {
    setViewingUser(null);
    setCredentialError('');
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Users</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} registered users</p>
        </div>
        <button onClick={fetchUsers} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-gray-400 rounded-full border border-white/[0.06] hover:border-white/[0.12] hover:text-white hover:bg-white/[0.04] transition-all duration-300">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-dark-800/40 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center shadow-glow-sm shrink-0">
                        <span className="text-xs font-bold text-white">{u.name?.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="font-medium text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{u.email}</td>
                  <td className="py-3 px-4">
                    {u.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-neon-purple/10 text-neon-purple-light border border-neon-purple/30">
                        <Shield className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-dark-700/50 text-gray-500 border border-white/5">
                        <User className="w-3 h-3" /> User
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-xs">
                    {new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => openCredentialModal(u._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-neon-cyan border border-neon-cyan/40 bg-neon-cyan/10 hover:bg-neon-cyan/20 hover:border-neon-cyan/60 transition-all duration-300"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(credentialLoading || credentialError || viewingUser) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-dark-800/95 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <h2 className="text-base font-bold text-white">User Credentials</h2>
              <button
                type="button"
                onClick={closeCredentialModal}
                className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {credentialLoading && <p className="text-sm text-gray-400">Loading credentials...</p>}

              {!credentialLoading && credentialError && (
                <p className="text-sm text-red-400">{credentialError}</p>
              )}

              {!credentialLoading && viewingUser && (
                <>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-gray-500">User ID</p>
                    <p className="mt-1 text-sm text-white break-all">{viewingUser._id}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-gray-500">Password</p>
                    <p className="mt-1 text-sm text-white break-all">{viewingUser.password || 'Not available'}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
