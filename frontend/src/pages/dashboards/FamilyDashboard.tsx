import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PasswordPrompt from '../../components/PasswordPrompt';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import type { Caretaker } from '../../types/caretaker';
import MessagePortal from '../../components/MessagePortal';
import API from '../../api';

const FamilyDashboard = () => {
  const [userName, setUserName] = useState('Family Member');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [hasSchedule, setHasSchedule] = useState(false);
  const [todaySchedule, setTodaySchedule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [caretaker, setCaretaker] = useState<Caretaker | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || 'Family Member');
        setUserEmail(user.email || '');
        setUserId(user._id || '');
        setHasSchedule(user.hasSchedule || false);
        setCaretaker(user.caretaker || null);

        if (user.hasSchedule && user._id) {
          fetchTodaySchedule(user._id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchTodaySchedule = async (residentId: string) => {
    try {
      const response = await API.get(`/schedules/resident/${residentId}/today`);
      if (response.data.success) {
        setTodaySchedule(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCalendar = async () => {
    try {
      const response = await API.get(`/schedules/resident/${userId}/export`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${userName.replace(/\s+/g, '-')}-schedule.ics`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download calendar:', error);
      alert('Failed to download calendar. Please try again.');
    }
  };

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

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] bg-clip-text text-transparent mb-4 animate-fade-in">
            👨‍👩‍👧‍👦 Family Dashboard
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 animate-fade-in-delay">Welcome, {userName}!</p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 mb-8">
          <Link
            to="/activities"
            className="group bg-gradient-to-br from-[#5A7A5F] to-[#7C9A7F] rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
          >
            <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">🎨</div>
            <h3 className="text-xl font-bold mb-2">Browse Activities</h3>
            <p className="text-white/90 text-sm">See what's happening</p>
          </Link>
          <Link
            to="/my-activities"
            className="group bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
          >
            <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">📋</div>
            <h3 className="text-xl font-bold mb-2">My Activities</h3>
            <p className="text-white/90 text-sm">Track participation</p>
          </Link>
          <Link
            to="/our-homes"
            className="group bg-gradient-to-br from-[#7C9A7F] to-[#5A7A5F] rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
          >
            <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">🏡</div>
            <h3 className="text-xl font-bold mb-2">Our Homes</h3>
            <p className="text-white/90 text-sm">Virtual tour</p>
          </Link>
        </div>

        {/* Main Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Daily Schedule */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
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
                <div className="flex items-start p-4 bg-blue-50 rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer">
                  <div className="text-2xl mr-3">🍳</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-gray-900">Breakfast</p>
                      <span className="text-sm text-[#4A6741] font-semibold">8:00 AM</span>
                    </div>
                    <p className="text-sm text-gray-600">Dining Hall</p>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-[#E8EDE7] rounded-xl border border-[#D4B896] hover:border-[#8B6F47] hover:shadow-sm transition-all duration-200 cursor-pointer">
                  <div className="text-2xl mr-3">🎨</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-gray-900">Art Class</p>
                      <span className="text-sm text-[#4A6741] font-semibold">10:00 AM</span>
                    </div>
                    <p className="text-sm text-gray-600">Main Hall | Registered</p>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-orange-50 rounded-xl border border-orange-200 hover:border-orange-300 hover:shadow-sm transition-all duration-200 cursor-pointer">
                  <div className="text-2xl mr-3">🍽️</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-gray-900">Lunch</p>
                      <span className="text-sm text-orange-600 font-semibold">12:00 PM</span>
                    </div>
                    <p className="text-sm text-gray-600">Dining Hall</p>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-green-50 rounded-xl border border-green-200 hover:border-green-300 hover:shadow-sm transition-all duration-200 cursor-pointer">
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

                <div className="bg-gray-50/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 text-center">
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
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="text-3xl mr-2">👤</span>
                Account Info
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
                  <span className="px-3 py-1 bg-gradient-to-r from-[#7C9A7F]/20 to-[#D4B896]/20 text-[#4A6741] text-sm font-bold rounded-full border border-[#7C9A7F]/30">Family Member</span>
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
                  <p className="text-sm text-gray-600 mb-1">Resident Relation</p>
                  <p className="font-semibold text-gray-900">Robert Williams (Father)</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">Member since: December 2025</p>
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

        {/* Care Team Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 mb-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-3xl mr-2">👨‍⚕️</span>
            Care Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200">
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
            <div className="bg-gradient-to-r from-[#E8EDE7] to-[#F5F1E8] p-4 rounded-xl border border-[#D4B896] hover:border-[#8B6F47] hover:shadow-sm transition-all duration-200">
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

export default FamilyDashboard;
