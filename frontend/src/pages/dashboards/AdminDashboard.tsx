import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PasswordPrompt from '../../components/PasswordPrompt';
import ChangePasswordModal from '../../components/ChangePasswordModal';

const AdminDashboard = () => {
  const [userName, setUserName] = useState('Admin');
  const [userEmail, setUserEmail] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || 'Admin');
        setUserEmail(user.email || '');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleViewAccountInfo = () => {
    setShowPasswordPrompt(true);
  };

  const handlePasswordSuccess = () => {
    setShowPasswordPrompt(false);
    setShowAccountInfo(true);
  };

  const handleChangePasswordSuccess = () => {
    setShowChangePasswordModal(false);
    setPasswordChangeSuccess(true);
    setTimeout(() => setPasswordChangeSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#4A6741] to-[#5A7A5F] bg-clip-text text-transparent mb-4">
            ⚡ Admin Dashboard
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700">Welcome back, {userName}!</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Link
            to="/admin/users"
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-xl font-bold mb-2">Manage Users</h3>
            <p className="text-white/90 text-sm">View and edit all users</p>
          </Link>
          <Link
            to="/admin/leads"
            className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <div className="text-4xl mb-3">📞</div>
            <h3 className="text-xl font-bold mb-2">Manage Leads</h3>
            <p className="text-white/90 text-sm">View customer inquiries</p>
          </Link>
          <Link
            to="/admin/applications"
            className="bg-gradient-to-br from-[#5A7A5F] to-[#7C9A7F] rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <div className="text-4xl mb-3">⚙️</div>
            <h3 className="text-xl font-bold mb-2">Resident Applications</h3>
            <p className="text-white/90 text-sm">Review applications</p>
          </Link>
          <Link
            to="/admin/opportunity-applications"
            className="bg-gradient-to-br from-[#7C9A7F] to-[#5A7A5F] rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="text-xl font-bold mb-2">Activity Registrations</h3>
            <p className="text-white/90 text-sm">Manage activity requests</p>
          </Link>
        </div>

        {/* Main Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Caretaker Schedules */}
          <div className="bg-[#F5F1E8] rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="text-3xl mr-2">👨‍⚕️</span>
                Caretaker Schedules
              </h2>
              <button className="text-[#4A6741] hover:text-indigo-800 font-semibold text-sm">
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {/* Placeholder for caretaker schedules */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-gray-900">Sarah Johnson</p>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">ON DUTY</span>
                </div>
                <p className="text-sm text-gray-600">Shift: 8:00 AM - 4:00 PM</p>
                <p className="text-xs text-gray-500 mt-1">Assigned: Room 101, 102, 103</p>
              </div>
              <div className="bg-gradient-to-r from-[#E8EDE7] to-[#F5F1E8] p-4 rounded-xl border border-purple-200">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-gray-900">Michael Chen</p>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">UPCOMING</span>
                </div>
                <p className="text-sm text-gray-600">Shift: 4:00 PM - 12:00 AM</p>
                <p className="text-xs text-gray-500 mt-1">Assigned: Room 104, 105, 106</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                <p className="text-sm text-gray-500">🔧 Full schedule management coming soon</p>
              </div>
            </div>
          </div>

          {/* Client/Resident Schedules */}
          <div className="bg-[#F5F1E8] rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="text-3xl mr-2">👥</span>
                Resident Schedules
              </h2>
              <button className="text-[#4A6741] hover:text-indigo-800 font-semibold text-sm">
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {/* Placeholder for resident schedules */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-gray-900">Robert Williams</p>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">ACTIVE</span>
                </div>
                <p className="text-sm text-gray-600">Today: Breakfast → Morning Activity → Lunch → Rest</p>
                <p className="text-xs text-gray-500 mt-1">Room 101 | Caretaker: Sarah J.</p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border border-orange-200">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-gray-900">Mary Thompson</p>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">ACTIVE</span>
                </div>
                <p className="text-sm text-gray-600">Today: Medication → Therapy → Lunch → Gardening Club</p>
                <p className="text-xs text-gray-500 mt-1">Room 102 | Caretaker: Sarah J.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                <p className="text-sm text-gray-500">🔧 Full resident scheduling coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Schedule & Account Info Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Activity/Daily Schedule */}
          <div className="bg-[#F5F1E8] rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="text-3xl mr-2">📅</span>
                Today's Activities
              </h2>
              <Link to="/activities" className="text-[#4A6741] hover:text-indigo-800 font-semibold text-sm">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-[#E8EDE7] rounded-xl border border-purple-200">
                <div className="text-2xl mr-3">🎨</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Art Class</p>
                  <p className="text-sm text-gray-600">10:00 AM - 11:30 AM | Main Hall</p>
                </div>
                <span className="px-2 py-1 bg-purple-100 text-[#3A5531] text-xs font-bold rounded-full">12 joined</span>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-xl border border-green-200">
                <div className="text-2xl mr-3">🌱</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Gardening Club</p>
                  <p className="text-sm text-gray-600">2:00 PM - 3:30 PM | Garden</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">8 joined</span>
              </div>
              <div className="flex items-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-2xl mr-3">🎬</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Movie Night</p>
                  <p className="text-sm text-gray-600">7:00 PM - 9:00 PM | Theater Room</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">15 joined</span>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-[#F5F1E8] rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="text-3xl mr-2">👤</span>
                Account Info
              </h2>
            </div>
            {!showAccountInfo ? (
              <div className="text-center py-8">
                <div className="inline-block p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-4">
                  <svg className="h-12 w-12 text-[#4A6741]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Protected Information</h3>
                <p className="text-sm text-gray-600 mb-4">Verify your password to view account details</p>
                <button
                  onClick={handleViewAccountInfo}
                  className="px-6 py-3 bg-gradient-to-r from-[#4A6741] to-[#5A7A5F] text-white rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  View Account Info
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {passwordChangeSuccess && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">Password changed successfully!</p>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Name</p>
                  <p className="font-semibold text-gray-900">{userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Role</p>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-full">Administrator</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Login Email</p>
                  <p className="font-semibold text-gray-900">{userEmail || 'No email on file'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Password</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">••••••••</p>
                    <button
                      onClick={() => setShowChangePasswordModal(true)}
                      className="text-sm text-[#4A6741] hover:text-indigo-800 font-semibold"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Contact Phone</p>
                  <p className="font-semibold text-gray-900">
                    <a href="tel:+14257899091" className="hover:text-[#4A6741]">(425) 789-9091</a>
                  </p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">Last login: Today at 9:15 AM</p>
                </div>
                <button
                  onClick={() => setShowAccountInfo(false)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all text-sm"
                >
                  Hide Account Info
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Message Portal Placeholder */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center">
                <span className="text-4xl mr-3">💬</span>
                Message Portal
              </h2>
              <p className="text-white/90">Communicate with caretakers and residents</p>
            </div>
            <span className="px-4 py-2 bg-[#F5F1E8]/20 backdrop-blur-sm rounded-full font-bold text-sm">COMING SOON</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-[#F5F1E8]/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">👥</span>
                <p className="font-bold">Group Chat</p>
              </div>
              <p className="text-sm text-white/80">Broadcast to all staff or create groups</p>
            </div>
            <div className="bg-[#F5F1E8]/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">✉️</span>
                <p className="font-bold">Direct Messages</p>
              </div>
              <p className="text-sm text-white/80">One-on-one conversations with staff</p>
            </div>
          </div>
        </div>
      </div>

      {/* Password Prompt Modal */}
      <PasswordPrompt
        isOpen={showPasswordPrompt}
        onClose={() => setShowPasswordPrompt(false)}
        onSuccess={handlePasswordSuccess}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSuccess={handleChangePasswordSuccess}
      />
    </div>
  );
};

export default AdminDashboard;
