import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PasswordPrompt from '../../components/PasswordPrompt';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import MessagePortal from '../../components/MessagePortal';
import API from '../../api';

const CaretakerDashboard = () => {
  const [userName, setUserName] = useState('Caretaker');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [hasSchedule, setHasSchedule] = useState(false);
  const [schedule, setSchedule] = useState<any>(null);
  const [currentShift, setCurrentShift] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
        setUserId(user._id || '');
        setHasSchedule(user.hasSchedule || false);

        // Fetch schedule if user has one
        if (user.hasSchedule && user._id) {
          fetchSchedule(user._id);
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

  const fetchSchedule = async (caretakerId: string) => {
    try {
      const response = await API.get(`/schedules/caretaker/${caretakerId}`);
      if (response.data.success) {
        setSchedule(response.data.data);
      }

      // Fetch current shift
      const shiftResponse = await API.get(`/schedules/caretaker/${caretakerId}/current-shift`);
      if (shiftResponse.data.success) {
        setCurrentShift(shiftResponse.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCalendar = async () => {
    try {
      const response = await API.get(`/schedules/caretaker/${userId}/export`, {
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

  // Calculate hours from schedule
  const hoursWorked = 32; // TODO: Track actual hours worked
  const hoursScheduled = schedule?.weeklyHours || 40;
  const hoursPercentage = (hoursWorked / hoursScheduled) * 100;

  // Get day names
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
            👨‍⚕️ Caretaker Dashboard
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-3">🏥</div>
            <h3 className="text-3xl font-black mb-1">{hoursWorked} hrs</h3>
            <p className="text-white/90 text-sm">Hours Worked This Week</p>
          </div>
          <div className="bg-gradient-to-br from-[#5A7A5F] to-[#7C9A7F] rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-3xl font-black mb-1">6</h3>
            <p className="text-white/90 text-sm">Residents Assigned</p>
          </div>
          <div className="bg-gradient-to-br from-[#7C9A7F] to-[#5A7A5F] rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-3xl font-black mb-1">12</h3>
            <p className="text-white/90 text-sm">Tasks Completed Today</p>
          </div>
        </div>

        {/* Hours Meter & Work Schedule Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Hours Worked Meter */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
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
                <p className="font-semibold text-gray-700 mb-3">Weekly Schedule</p>
                {schedule && schedule.shifts && schedule.shifts.length > 0 ? (
                  schedule.shifts
                    .filter((shift: any) => shift.isRecurring)
                    .sort((a: any, b: any) => a.dayOfWeek - b.dayOfWeek)
                    .map((shift: any, index: number) => {
                      const [startHour, startMin] = shift.startTime.split(':').map(Number);
                      const [endHour, endMin] = shift.endTime.split(':').map(Number);
                      const hours = (endHour * 60 + endMin - (startHour * 60 + startMin)) / 60;

                      return (
                        <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                          <span className="text-sm text-gray-700">{dayNames[shift.dayOfWeek]}</span>
                          <span className="font-semibold text-green-700">
                            {shift.startTime} - {shift.endTime} ({hours}h)
                          </span>
                        </div>
                      );
                    })
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No recurring shifts scheduled</p>
                )}
              </div>
            </div>
            )}
          </div>

          {/* Work Schedule */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="text-3xl mr-2">📅</span>
                My Schedule
              </h2>
              <div className="flex items-center gap-2">
                {currentShift && currentShift.onDuty && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full shadow-sm">ON SHIFT</span>
                )}
                {hasSchedule && schedule && (
                  <button
                    onClick={downloadCalendar}
                    className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full shadow-sm hover:bg-purple-200 transition"
                  >
                    📥 Download Calendar
                  </button>
                )}
              </div>
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
              {loading ? (
                <div className="text-center py-6">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading schedule...</p>
                </div>
              ) : currentShift && currentShift.onDuty ? (
                <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border-2 border-teal-300">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-gray-900 text-lg">Current Shift - {dayNames[new Date().getDay()]}</p>
                      <p className="text-teal-600 font-semibold">{currentShift.shift.startTime} - {currentShift.shift.endTime}</p>
                    </div>
                    <span className="text-2xl">🟢</span>
                  </div>
                  {currentShift.shift.assignedRooms && currentShift.shift.assignedRooms.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Assigned Rooms: {currentShift.shift.assignedRooms.join(', ')}
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-gray-600 text-center">Not currently on shift</p>
                </div>
              )}

              {/* All Shifts */}
              {schedule && schedule.shifts && schedule.shifts.length > 0 && (
                <div className="space-y-2">
                  <p className="font-semibold text-gray-700 text-sm">Your Shifts</p>
                  {schedule.shifts
                    .filter((shift: any) => shift.isRecurring)
                    .sort((a: any, b: any) => a.dayOfWeek - b.dayOfWeek)
                    .map((shift: any, index: number) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex justify-between">
                          <p className="font-semibold text-gray-900">{dayNames[shift.dayOfWeek]}</p>
                          <p className="text-sm text-[#4A6741]">{shift.startTime} - {shift.endTime}</p>
                        </div>
                        {shift.assignedRooms && shift.assignedRooms.length > 0 && (
                          <p className="text-xs text-gray-600 mt-1">Rooms: {shift.assignedRooms.join(', ')}</p>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {schedule && schedule.notes && (
                <div className="bg-yellow-50/50 backdrop-blur-sm p-4 rounded-xl border border-yellow-200">
                  <p className="text-sm text-gray-700"><strong>Note:</strong> {schedule.notes}</p>
                </div>
              )}
            </div>
            )}
          </div>
        </div>

        {/* Assigned Residents & Account Info Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Assigned Residents */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-3xl mr-2">👥</span>
              My Residents
            </h2>
            <div className="space-y-3">
              <div className="p-4 bg-[#E8EDE7] rounded-xl border border-[#D4B896] hover:border-[#8B6F47] hover:shadow-md transition-all duration-200 cursor-pointer">
                <p className="font-semibold text-gray-900 mb-1">Robert Williams</p>
                <p className="text-sm text-gray-600">Room 101 | Basic Care</p>
                <p className="text-xs text-[#4A6741] mt-1">Next: Medication at 2:00 PM</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer">
                <p className="font-semibold text-gray-900 mb-1">Mary Thompson</p>
                <p className="text-sm text-gray-600">Room 102 | Intermediate Care</p>
                <p className="text-xs text-green-600 mt-1">Next: Physical Therapy at 3:00 PM</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer">
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
                  <span className="px-3 py-1 bg-gradient-to-r from-[#7C9A7F]/20 to-[#D4B896]/20 text-[#4A6741] text-sm font-bold rounded-full border border-[#7C9A7F]/30">Caretaker</span>
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

export default CaretakerDashboard;
