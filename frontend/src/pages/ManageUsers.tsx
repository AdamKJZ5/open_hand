import { useState, useEffect } from 'react';
import API from '../api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'caretaker' | 'family' | 'default';
  hasSchedule?: boolean;
  createdAt: string;
}

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (filterRole === 'all') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.role === filterRole));
    }
  }, [filterRole, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get('/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      setUpdating(true);
      await API.put(`/users/${userId}/role`, { role: newRole });
      await fetchUsers();
      setShowRoleModal(false);
      setSelectedUser(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleSchedule = async (userId: string, currentStatus: boolean) => {
    try {
      await API.put(`/users/${userId}/schedule`, { hasSchedule: !currentStatus });
      await fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update schedule status');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await API.delete(`/users/${userId}`);
      await fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-[#3A5531] border-purple-200';
      case 'caretaker': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'family': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'default': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return '⚡';
      case 'caretaker': return '👨‍⚕️';
      case 'family': return '👨‍👩‍👧‍👦';
      case 'default': return '⏳';
      default: return '👤';
    }
  };

  const stats = {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    caretaker: users.filter(u => u.role === 'caretaker').length,
    family: users.filter(u => u.role === 'family').length,
    default: users.filter(u => u.role === 'default').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
        <div className="text-2xl font-bold text-[#4A6741]">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-black bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] bg-clip-text text-transparent mb-2">
            👥 Manage Users
          </h1>
          <p className="text-xl text-gray-700">View and manage all users in the system</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-xl p-5 border-2 border-purple-200 transform hover:scale-105 transition-all">
            <div className="text-4xl font-black text-[#4A6741]">{stats.total}</div>
            <p className="text-sm text-gray-700 font-bold mt-1">Total Users</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-xl p-5 border-2 border-purple-200 transform hover:scale-105 transition-all">
            <div className="text-4xl font-black text-[#4A6741]">{stats.admin}</div>
            <p className="text-sm text-gray-700 font-bold mt-1">Admins</p>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl shadow-xl p-5 border-2 border-teal-200 transform hover:scale-105 transition-all">
            <div className="text-4xl font-black text-teal-600">{stats.caretaker}</div>
            <p className="text-sm text-gray-700 font-bold mt-1">Caretakers</p>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl shadow-xl p-5 border-2 border-pink-200 transform hover:scale-105 transition-all">
            <div className="text-4xl font-black text-pink-600">{stats.family}</div>
            <p className="text-sm text-gray-700 font-bold mt-1">Family</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-xl p-5 border-2 border-yellow-200 transform hover:scale-105 transition-all">
            <div className="text-4xl font-black text-yellow-600">{stats.default}</div>
            <p className="text-sm text-gray-700 font-bold mt-1">Pending</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-[#F5F1E8] rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterRole('all')}
              className={`px-5 py-2 rounded-full font-semibold transition-all transform hover:scale-105 ${
                filterRole === 'all'
                  ? 'bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilterRole('admin')}
              className={`px-5 py-2 rounded-full font-semibold transition-all transform hover:scale-105 ${
                filterRole === 'admin'
                  ? 'bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white shadow-lg'
                  : 'bg-[#E8EDE7] text-[#3A5531] hover:bg-purple-100'
              }`}
            >
              ⚡ Admins ({stats.admin})
            </button>
            <button
              onClick={() => setFilterRole('caretaker')}
              className={`px-5 py-2 rounded-full font-semibold transition-all transform hover:scale-105 ${
                filterRole === 'caretaker'
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg'
                  : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
              }`}
            >
              👨‍⚕️ Caretakers ({stats.caretaker})
            </button>
            <button
              onClick={() => setFilterRole('family')}
              className={`px-5 py-2 rounded-full font-semibold transition-all transform hover:scale-105 ${
                filterRole === 'family'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg'
                  : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
              }`}
            >
              👨‍👩‍👧‍👦 Family ({stats.family})
            </button>
            <button
              onClick={() => setFilterRole('default')}
              className={`px-5 py-2 rounded-full font-semibold transition-all transform hover:scale-105 ${
                filterRole === 'default'
                  ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg'
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              }`}
            >
              ⏳ Pending ({stats.default})
            </button>
          </div>
        </div>

        {/* Desktop Users Table */}
        <div className="hidden md:block bg-[#F5F1E8] rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">User</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Role</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Schedule</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Created</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{getRoleIcon(user.role)}</span>
                          <span className="font-semibold text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRoleBadgeColor(user.role)}`}>
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleSchedule(user._id, user.hasSchedule || false)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                              user.hasSchedule
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {user.hasSchedule ? '✅ Active' : '⏸️ None'}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowRoleModal(true);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white rounded-lg text-xs font-semibold hover:from-[#3A5531] hover:to-[#6C8A6F] transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                          >
                            Change Role
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-xs font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Users Cards */}
        <div className="md:hidden space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="bg-[#F5F1E8] rounded-2xl shadow-xl p-12 text-center">
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user._id} className="bg-[#F5F1E8] rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{getRoleIcon(user.role)}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Role:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRoleBadgeColor(user.role)}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </div>
                  {user.role !== 'admin' && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Schedule:</span>
                      <button
                        onClick={() => handleToggleSchedule(user._id, user.hasSchedule || false)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          user.hasSchedule
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {user.hasSchedule ? '✅ Active' : '⏸️ None'}
                      </button>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Joined:</span>
                    <span className="text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowRoleModal(true);
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white rounded-xl font-semibold hover:from-[#3A5531] hover:to-[#6C8A6F] transition-all shadow-md"
                  >
                    Change Role
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id, user.name)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-md"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F5F1E8] rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Change User Role</h2>
            <p className="text-gray-600 mb-6">
              Change role for <strong>{selectedUser.name}</strong>
            </p>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleUpdateRole(selectedUser._id, 'admin')}
                disabled={updating}
                className="w-full p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all text-left shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <div className="flex items-center">
                  <span className="text-3xl mr-3">⚡</span>
                  <div>
                    <p className="font-black text-purple-900 text-lg">Administrator</p>
                    <p className="text-xs text-[#3A5531] font-medium">Full system access</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleUpdateRole(selectedUser._id, 'caretaker')}
                disabled={updating}
                className="w-full p-4 bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-300 rounded-xl hover:from-teal-100 hover:to-teal-200 transition-all text-left shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <div className="flex items-center">
                  <span className="text-3xl mr-3">👨‍⚕️</span>
                  <div>
                    <p className="font-black text-teal-900 text-lg">Caretaker</p>
                    <p className="text-xs text-teal-700 font-medium">Staff member with schedule</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleUpdateRole(selectedUser._id, 'family')}
                disabled={updating}
                className="w-full p-4 bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-300 rounded-xl hover:from-pink-100 hover:to-pink-200 transition-all text-left shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <div className="flex items-center">
                  <span className="text-3xl mr-3">👨‍👩‍👧‍👦</span>
                  <div>
                    <p className="font-black text-pink-900 text-lg">Family Member</p>
                    <p className="text-xs text-pink-700 font-medium">Resident family access</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleUpdateRole(selectedUser._id, 'default')}
                disabled={updating}
                className="w-full p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-xl hover:from-yellow-100 hover:to-yellow-200 transition-all text-left shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <div className="flex items-center">
                  <span className="text-3xl mr-3">⏳</span>
                  <div>
                    <p className="font-black text-yellow-900 text-lg">Pending/Default</p>
                    <p className="text-xs text-yellow-700 font-medium">Awaiting role assignment</p>
                  </div>
                </div>
              </button>
            </div>

            <button
              onClick={() => {
                setShowRoleModal(false);
                setSelectedUser(null);
              }}
              disabled={updating}
              className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-bold hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
