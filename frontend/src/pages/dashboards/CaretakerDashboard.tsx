import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PasswordPrompt from '../../components/PasswordPrompt';
import ChangePasswordModal from '../../components/ChangePasswordModal';

const CaretakerDashboard = () => {
  const [userName, setUserName] = useState('Caretaker');
  const [userEmail, setUserEmail] = useState('');
  const [hasSchedule, setHasSchedule] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || 'Caretaker');
        setUserEmail(user.email || '');
        setHasSchedule(user.hasSchedule || false);
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

  // Mock data for hours worked
  const hoursWorked = 32;
  const hoursScheduled = 40;
  const hoursPercentage = (hoursWorked / hoursScheduled) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            👨‍⚕️ Caretaker Dashboard
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700">Welcome, {userName}!</p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 mb-8">
          <Link
            to="/activities"
            className="bg-gradient-to-br from-[#5A7A5F] to-[#7C9A7F] rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="text-xl font-bold mb-2">Browse Activities</h3>
            <p className="text-white/90 text-sm">See what's happening</p>
          </Link>
          <Link
            to="/my-activities"
            className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-xl font-bold mb-2">My Activities</h3>
            <p className="text-white/90 text-sm">Track participation</p>
          </Link>
          <Link
            to="/our-homes"
            className="bg-gradient-to-br from-[#7C9A7F] to-[#5A7A5F] rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <div className="text-4xl mb-3">🏡</div>
            <h3 className="text-xl font-bold mb-2">Our Homes</h3>
            <p className="text-white/90 text-sm">Virtual tour</p>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-4xl mb-3">🏥</div>
            <h3 className="text-3xl font-black mb-1">{hoursWorked} hrs</h3>
            <p className="text-white/90 text-sm">Hours Worked This Week</p>
          </div>
          <div className="bg-gradient-to-br from-[#5A7A5F] to-[#7C9A7F] rounded-2xl p-6 text-white shadow-xl">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-3xl font-black mb-1">6</h3>
            <p className="text-white/90 text-sm">Residents Assigned</p>
          </div>
          <div className="bg-gradient-to-br from-[#7C9A7F] to-[#5A7A5F] rounded-2xl p-6 text-white shadow-xl">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-3xl font-black mb-1">12</h3>
            <p className="text-white/90 text-sm">Tasks Completed Today</p>
          </div>
        </div>

        {/* Hours Meter & Work Schedule Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Hours Worked Meter */}
          <div className="bg-[#F5F1E8] rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-3xl mr-2">⏱️</span>
              Hours This Week
            </h2>
            {!hasSchedule ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded text-center">
                <div className="text-4xl mb-3">📋</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Schedule Not Assigned Yet</h3>
                <p className="text-sm text-gray-700">
                  Your work schedule will appear here once it has been assigned by management.
                </p>
              </div>
            ) : (
            <div className="space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Progress</span>
                  <span className="text-sm font-semibold text-teal-600">{hoursWorked} / {hoursScheduled} hours</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#7C9A7F] to-[#5A7A5F] h-4 rounded-full transition-all duration-500"
                    style={{ width: `${hoursPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{hoursPercentage.toFixed(0)}% complete</p>
              </div>

              {/* Daily Breakdown */}
              <div className="space-y-2 pt-4 border-t">
                <p className="font-semibold text-gray-700 mb-3">Daily Breakdown</p>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-700">Monday</span>
                  <span className="font-semibold text-green-700">8 hours</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-700">Tuesday</span>
                  <span className="font-semibold text-green-700">8 hours</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-700">Wednesday</span>
                  <span className="font-semibold text-green-700">8 hours</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-700">Thursday</span>
                  <span className="font-semibold text-green-700">8 hours</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg">
                  <span className="text-sm text-gray-700">Friday</span>
                  <span className="font-semibold text-yellow-700">In Progress</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Weekend</span>
                  <span className="font-semibold text-gray-500">Off</span>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Work Schedule */}
          <div className="bg-[#F5F1E8] rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="text-3xl mr-2">📅</span>
                My Schedule
              </h2>
              {hasSchedule && <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">ON SHIFT</span>}
            </div>
            {!hasSchedule ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded text-center">
                <div className="text-4xl mb-3">📋</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Schedule Not Assigned Yet</h3>
                <p className="text-sm text-gray-700">
                  Your work schedule will appear here once it has been assigned by management.
                </p>
              </div>
            ) : (
            <div className="space-y-3">
              {/* Today's Shift */}
              <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border-2 border-teal-300">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Today - Friday</p>
                    <p className="text-teal-600 font-semibold">8:00 AM - 4:00 PM</p>
                  </div>
                  <span className="text-2xl">🟢</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Assigned Rooms: 101, 102, 103, 104, 105, 106</p>
              </div>

              {/* Upcoming Shifts */}
              <div className="space-y-2">
                <p className="font-semibold text-gray-700 text-sm">Upcoming Shifts</p>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex justify-between">
                    <p className="font-semibold text-gray-900">Monday, Jan 6</p>
                    <p className="text-sm text-[#4A6741]">8:00 AM - 4:00 PM</p>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex justify-between">
                    <p className="font-semibold text-gray-900">Tuesday, Jan 7</p>
                    <p className="text-sm text-[#4A6741]">8:00 AM - 4:00 PM</p>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex justify-between">
                    <p className="font-semibold text-gray-900">Wednesday, Jan 8</p>
                    <p className="text-sm text-[#4A6741]">8:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                <p className="text-sm text-gray-500">🔧 Full schedule management coming soon</p>
              </div>
            </div>
            )}
          </div>
        </div>

        {/* Assigned Residents & Account Info Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Assigned Residents */}
          <div className="bg-[#F5F1E8] rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-3xl mr-2">👥</span>
              My Residents
            </h2>
            <div className="space-y-3">
              <div className="p-4 bg-[#E8EDE7] rounded-xl border border-purple-200">
                <p className="font-semibold text-gray-900 mb-1">Robert Williams</p>
                <p className="text-sm text-gray-600">Room 101 | Basic Care</p>
                <p className="text-xs text-[#4A6741] mt-1">Next: Medication at 2:00 PM</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="font-semibold text-gray-900 mb-1">Mary Thompson</p>
                <p className="text-sm text-gray-600">Room 102 | Intermediate Care</p>
                <p className="text-xs text-green-600 mt-1">Next: Physical Therapy at 3:00 PM</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="font-semibold text-gray-900 mb-1">James Anderson</p>
                <p className="text-sm text-gray-600">Room 103 | Advanced Care</p>
                <p className="text-xs text-[#4A6741] mt-1">Next: Dinner at 6:00 PM</p>
              </div>
              <button className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all text-sm font-semibold text-gray-700">
                View All Residents (6) →
              </button>
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
                <div className="inline-block p-4 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full mb-4">
                  <svg className="h-12 w-12 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Protected Information</h3>
                <p className="text-sm text-gray-600 mb-4">Verify your password to view account details</p>
                <button
                  onClick={handleViewAccountInfo}
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-full font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all transform hover:scale-105"
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
                  <span className="px-3 py-1 bg-teal-100 text-teal-700 text-sm font-bold rounded-full">Caretaker</span>
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
                      className="text-sm text-teal-600 hover:text-teal-800 font-semibold"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Employee ID</p>
                  <p className="font-semibold text-gray-900">CT-2024-1234</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Certifications</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">CPR</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">First Aid</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">CNA</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">Employee since: June 2024</p>
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
        <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center">
                <span className="text-4xl mr-3">💬</span>
                Message Portal
              </h2>
              <p className="text-white/90">Communicate with residents and their families</p>
            </div>
            <span className="px-4 py-2 bg-[#F5F1E8]/20 backdrop-blur-sm rounded-full font-bold text-sm">COMING SOON</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-[#F5F1E8]/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">👥</span>
                <p className="font-bold">Message Residents</p>
              </div>
              <p className="text-sm text-white/80">Direct communication with your residents</p>
            </div>
            <div className="bg-[#F5F1E8]/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">👨‍👩‍👧‍👦</span>
                <p className="font-bold">Message Families</p>
              </div>
              <p className="text-sm text-white/80">Updates and communication with families</p>
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

export default CaretakerDashboard;
