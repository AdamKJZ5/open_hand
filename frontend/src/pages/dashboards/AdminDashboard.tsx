import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PasswordPrompt from '../../components/PasswordPrompt';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import MessagePortal from '../../components/MessagePortal';

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
        // Silently handle parsing error
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
    <div className="min-h-screen bg-[#F5F1E8] pt-[100px] pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#7C9A7F]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-40 right-10 w-96 h-96 bg-[#8B6F47]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-[#D4B896]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] bg-clip-text text-transparent mb-4 animate-fade-in">
            ⚡ Admin Dashboard
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 animate-fade-in-delay">Welcome back, {userName}!</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Link
            to="/admin/users"
            className="group relative bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 border-2 border-transparent hover:border-indigo-200 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Manage Users</h3>
              <p className="text-sm text-gray-600">View and edit all users</p>
            </div>
          </Link>
          <Link
            to="/admin/leads"
            className="group relative bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 border-2 border-transparent hover:border-cyan-200 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="text-3xl">📞</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Manage Leads</h3>
              <p className="text-sm text-gray-600">View customer inquiries</p>
            </div>
          </Link>
          <Link
            to="/admin/applications"
            className="group relative bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 border-2 border-transparent hover:border-[#7C9A7F] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#5A7A5F]/5 to-[#7C9A7F]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#5A7A5F] to-[#7C9A7F] rounded-2xl mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="text-3xl">⚙️</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Resident Applications</h3>
              <p className="text-sm text-gray-600">Review applications</p>
            </div>
          </Link>
          <Link
            to="/admin/opportunity-applications"
            className="group relative bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 border-2 border-transparent hover:border-[#7C9A7F] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#7C9A7F]/5 to-[#5A7A5F]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#7C9A7F] to-[#5A7A5F] rounded-2xl mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Activity Registrations</h3>
              <p className="text-sm text-gray-600">Manage activity requests</p>
            </div>
          </Link>
        </div>

        {/* Main Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Caretaker Schedules */}
          <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border-2 border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-3xl">👨‍⚕️</span>
                <span>Caretaker Schedules</span>
              </h2>
              <button className="px-4 py-2 text-[#4A6741] hover:bg-[#4A6741] hover:text-white font-semibold text-sm rounded-full transition-all duration-200 border-2 border-[#4A6741]">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {/* Placeholder for caretaker schedules */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-bold text-gray-900 text-lg">Sarah Johnson</p>
                  <span className="px-4 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full shadow-sm">ON DUTY</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">Shift: 8:00 AM - 4:00 PM</p>
                <p className="text-xs text-gray-600 mt-2">Assigned: Room 101, 102, 103</p>
              </div>
              <div className="bg-gradient-to-r from-[#E8EDE7] to-[#F5F1E8] p-5 rounded-2xl border-2 border-[#D4B896] hover:border-[#8B6F47] hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-bold text-gray-900 text-lg">Michael Chen</p>
                  <span className="px-4 py-1.5 bg-yellow-500 text-white text-xs font-bold rounded-full shadow-sm">UPCOMING</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">Shift: 4:00 PM - 12:00 AM</p>
                <p className="text-xs text-gray-600 mt-2">Assigned: Room 104, 105, 106</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-2xl border-2 border-dashed border-gray-300 text-center">
                <p className="text-sm text-gray-500 font-medium">🔧 Full schedule management coming soon</p>
              </div>
            </div>
          </div>

          {/* Client/Resident Schedules */}
          <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border-2 border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-3xl">👥</span>
                <span>Resident Schedules</span>
              </h2>
              <button className="px-4 py-2 text-[#4A6741] hover:bg-[#4A6741] hover:text-white font-semibold text-sm rounded-full transition-all duration-200 border-2 border-[#4A6741]">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {/* Placeholder for resident schedules */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-2xl border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-bold text-gray-900 text-lg">Robert Williams</p>
                  <span className="px-4 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-full shadow-sm">ACTIVE</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">Today: Breakfast → Morning Activity → Lunch → Rest</p>
                <p className="text-xs text-gray-600 mt-2">Room 101 | Caretaker: Sarah J.</p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-5 rounded-2xl border-2 border-orange-200 hover:border-orange-400 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-bold text-gray-900 text-lg">Mary Thompson</p>
                  <span className="px-4 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-full shadow-sm">ACTIVE</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">Today: Medication → Therapy → Lunch → Gardening Club</p>
                <p className="text-xs text-gray-600 mt-2">Room 102 | Caretaker: Sarah J.</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-2xl border-2 border-dashed border-gray-300 text-center">
                <p className="text-sm text-gray-500 font-medium">🔧 Full resident scheduling coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Schedule & Account Info Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Activity/Daily Schedule */}
          <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border-2 border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-3xl">📅</span>
                <span>Today's Activities</span>
              </h2>
              <Link to="/activities" className="px-4 py-2 text-[#4A6741] hover:bg-[#4A6741] hover:text-white font-semibold text-sm rounded-full transition-all duration-200 border-2 border-[#4A6741]">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-[#E8EDE7] rounded-2xl border-2 border-[#D4B896] hover:border-[#8B6F47] hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="text-3xl">🎨</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">Art Class</p>
                  <p className="text-sm text-gray-600">10:00 AM - 11:30 AM | Main Hall</p>
                </div>
                <span className="px-4 py-1.5 bg-purple-500 text-white text-xs font-bold rounded-full shadow-sm">12</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="text-3xl">🌱</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">Gardening Club</p>
                  <p className="text-sm text-gray-600">2:00 PM - 3:30 PM | Garden</p>
                </div>
                <span className="px-4 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full shadow-sm">8</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="text-3xl">🎬</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">Movie Night</p>
                  <p className="text-sm text-gray-600">7:00 PM - 9:00 PM | Theater Room</p>
                </div>
                <span className="px-4 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-full shadow-sm">15</span>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border-2 border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-3xl">👤</span>
                <span>Account Info</span>
              </h2>
            </div>
            {!showAccountInfo ? (
              <div className="text-center py-8">
                <div className="inline-block p-4 bg-gradient-to-r from-[#7C9A7F]/20 to-[#D4B896]/20 rounded-full mb-4">
                  <svg className="h-12 w-12 text-[#4A6741]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Protected Information</h3>
                <p className="text-sm text-gray-600 mb-4">Verify your password to view account details</p>
                <button
                  onClick={handleViewAccountInfo}
                  className="px-6 py-3 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white rounded-full font-semibold hover:from-[#3A5531] hover:to-[#6C8A6F] transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
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
                  <span className="px-3 py-1 bg-gradient-to-r from-[#7C9A7F]/20 to-[#D4B896]/20 text-[#4A6741] text-sm font-bold rounded-full border border-[#7C9A7F]/30">Administrator</span>
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
                      className="text-sm text-[#4A6741] hover:text-[#3A5531] font-semibold transition-colors duration-200"
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
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 hover:border-[#7C9A7F] transition-all duration-200 text-sm"
                >
                  Hide Account Info
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Message Portal */}
        <MessagePortal />
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
