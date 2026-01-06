import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PasswordPrompt from '../../components/PasswordPrompt';
import ChangePasswordModal from '../../components/ChangePasswordModal';

const FamilyDashboard = () => {
  const [userName, setUserName] = useState('Family Member');
  const [userEmail, setUserEmail] = useState('');
  const [hasSchedule, setHasSchedule] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [caretaker, setCaretaker] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || 'Family Member');
        setUserEmail(user.email || '');
        setHasSchedule(user.hasSchedule || false);
        setCaretaker(user.caretaker || null);
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-[100px] pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            👨‍👩‍👧‍👦 Family Dashboard
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

        {/* Main Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Daily Schedule */}
          <div className="bg-[#F5F1E8] rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="text-3xl mr-2">📅</span>
                Today's Schedule
              </h2>
              <span className="text-sm text-gray-500">Jan 3, 2026</span>
            </div>
            {hasSchedule ? (
              <div className="space-y-3">
                {/* Placeholder schedule items */}
                <div className="flex items-start p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-2xl mr-3">🍳</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-gray-900">Breakfast</p>
                      <span className="text-sm text-[#4A6741] font-semibold">8:00 AM</span>
                    </div>
                    <p className="text-sm text-gray-600">Dining Hall</p>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-[#E8EDE7] rounded-xl border border-purple-200">
                  <div className="text-2xl mr-3">🎨</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-gray-900">Art Class</p>
                      <span className="text-sm text-[#4A6741] font-semibold">10:00 AM</span>
                    </div>
                    <p className="text-sm text-gray-600">Main Hall | Registered</p>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="text-2xl mr-3">🍽️</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-gray-900">Lunch</p>
                      <span className="text-sm text-orange-600 font-semibold">12:00 PM</span>
                    </div>
                    <p className="text-sm text-gray-600">Dining Hall</p>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="text-2xl mr-3">🌱</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-gray-900">Gardening Club</p>
                      <span className="text-sm text-green-600 font-semibold">2:00 PM</span>
                    </div>
                    <p className="text-sm text-gray-600">Garden | Registered</p>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-pink-50 rounded-xl border border-pink-200">
                  <div className="text-2xl mr-3">🍲</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-gray-900">Dinner</p>
                      <span className="text-sm text-[#8B6F47] font-semibold">6:00 PM</span>
                    </div>
                    <p className="text-sm text-gray-600">Dining Hall</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                  <p className="text-sm text-gray-500">🔧 Full schedule management coming soon</p>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded text-center">
                <div className="text-4xl mb-3">📋</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Schedule Not Assigned Yet</h3>
                <p className="text-sm text-gray-700">
                  Your personalized daily schedule will appear here once it has been created by our care team.
                </p>
              </div>
            )}
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
                <div className="inline-block p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full mb-4">
                  <svg className="h-12 w-12 text-[#8B6F47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Protected Information</h3>
                <p className="text-sm text-gray-600 mb-4">Verify your password to view account details</p>
                <button
                  onClick={handleViewAccountInfo}
                  className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-semibold hover:from-pink-700 hover:to-purple-700 transition-all transform hover:scale-105"
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
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 text-sm font-bold rounded-full">Family Member</span>
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
                      className="text-sm text-[#8B6F47] hover:text-pink-800 font-semibold"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Resident Relation</p>
                  <p className="font-semibold text-gray-900">Robert Williams (Father)</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">Member since: December 2025</p>
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

        {/* Care Team Info */}
        <div className="bg-[#F5F1E8] rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-3xl mr-2">👨‍⚕️</span>
            Care Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Primary Caretaker</p>
              {caretaker ? (
                <>
                  <p className="font-bold text-gray-900 mb-2">{caretaker.name || 'Not assigned'}</p>
                  {caretaker.schedule && <p className="text-sm text-gray-600">On duty: {caretaker.schedule}</p>}
                  {caretaker.phone && <p className="text-sm text-gray-600">Phone: {caretaker.phone}</p>}
                  {caretaker.email && <p className="text-sm text-gray-600">Email: {caretaker.email}</p>}
                </>
              ) : (
                <>
                  <p className="font-bold text-gray-900 mb-2">Not assigned</p>
                  <p className="text-sm text-gray-600 italic">No caretaker has been assigned yet. Please contact admin for assistance.</p>
                </>
              )}
            </div>
            <div className="bg-gradient-to-r from-[#E8EDE7] to-[#F5F1E8] p-4 rounded-xl border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Facility Contact</p>
              <p className="font-bold text-gray-900 mb-2">Admin Team</p>
              <p className="text-sm text-gray-600">Available: 24/7</p>
              <p className="text-sm text-gray-600">
                Phone: <a href="tel:+14257899091" className="text-[#4A6741] hover:underline">(425) 789-9091</a>
              </p>
              <p className="text-sm text-gray-600">
                Email: <a href="mailto:Openhandafh@gmail.com" className="text-[#4A6741] hover:underline">Openhandafh@gmail.com</a>
              </p>
            </div>
          </div>
        </div>

        {/* Message Portal Placeholder */}
        <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center">
                <span className="text-4xl mr-3">💬</span>
                Message Portal
              </h2>
              <p className="text-white/90">Stay connected with caretakers and admin</p>
            </div>
            <span className="px-4 py-2 bg-[#F5F1E8]/20 backdrop-blur-sm rounded-full font-bold text-sm">COMING SOON</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-[#F5F1E8]/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">👨‍⚕️</span>
                <p className="font-bold">Message Caretaker</p>
              </div>
              <p className="text-sm text-white/80">Direct line to your loved one's caretaker</p>
            </div>
            <div className="bg-[#F5F1E8]/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">⚡</span>
                <p className="font-bold">Message Admin</p>
              </div>
              <p className="text-sm text-white/80">Contact facility administration</p>
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

export default FamilyDashboard;
