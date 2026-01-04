import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

interface Activity {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  category: string;
  status: string;
}

const Activities = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [requestData, setRequestData] = useState({
    message: '',
    availability: '',
    experience: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    // Get user role from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role || '');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await API.get('/opportunities');
      setActivities(res.data);
    } catch (error: any) {
      console.error("Error fetching activities:", error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowRequestModal(true);
    setRequestData({ message: '', availability: '', experience: '' });
    setRequestError('');
    setRequestSuccess(false);
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setRequestError('');

    try {
      await API.post(`/opportunities/${selectedActivity?._id}/apply`, requestData);
      setRequestSuccess(true);
      setTimeout(() => {
        setShowRequestModal(false);
        setRequestSuccess(false);
      }, 2000);
    } catch (error: any) {
      setRequestError(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Gardening': 'from-[#7C9A7F] to-[#5A7A5F]',
      'Food': 'from-[#8B6F47] to-[#7C6347]',
      'Education': 'from-[#4A6741] to-[#5A7A5F]',
      'Environment': 'from-[#5A7A5F] to-[#7C9A7F]',
      'Health': 'from-[#8B6F47] to-[#D4B896]',
      'Other': 'from-[#736B5E] to-[#8B6F47]'
    };
    return colors[category] || 'from-[#736B5E] to-[#8B6F47]';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
        <div className="text-2xl font-bold text-[#4A6741]">✨ Loading activities...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] bg-clip-text text-transparent mb-4">
            {userRole === 'admin' ? '⚡ Admin Dashboard' : '🎨 Activities & Events'}
          </h1>
          <p className="text-xl text-gray-700">
            {userRole === 'admin'
              ? 'Manage applications, leads, and facility activities'
              : 'Discover and join activities happening at our facility!'}
          </p>
          <Link
            to="/my-activities"
            className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white rounded-full font-bold hover:from-[#3A5531] hover:to-[#6C8A6F] transition-all transform hover:scale-105 shadow-lg"
          >
            📋 My Activities
          </Link>
        </div>

        {/* Role-Specific Quick Links */}
        {userRole === 'admin' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to="/admin/leads"
                className="bg-gradient-to-br from-[#4A6741] to-[#7C9A7F] rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <div className="text-4xl mb-3">📞</div>
                <h3 className="text-xl font-bold mb-2">Manage Leads</h3>
                <p className="text-white/90 text-sm">View and respond to customer inquiries</p>
              </Link>
              <Link
                to="/admin/applications"
                className="bg-gradient-to-br from-[#5A7A5F] to-[#7C9A7F] rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <div className="text-4xl mb-3">⚙️</div>
                <h3 className="text-xl font-bold mb-2">Resident Applications</h3>
                <p className="text-white/90 text-sm">Review resident care applications</p>
              </Link>
              <Link
                to="/admin/opportunity-applications"
                className="bg-gradient-to-br from-[#7C9A7F] to-[#5A7A5F] rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <div className="text-4xl mb-3">🎨</div>
                <h3 className="text-xl font-bold mb-2">Activity Registrations</h3>
                <p className="text-white/90 text-sm">Manage activity participation requests</p>
              </Link>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {userRole === 'admin' ? '📋 Current Activities' : '🎨 Available Activities'}
          </h2>
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-600">No activities available at the moment.</p>
            <p className="text-gray-500">Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="bg-[#F5F1E8] rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-[#7C9A7F]"
              >
                <div className={`h-3 bg-gradient-to-r ${getCategoryColor(activity.category)}`}></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r ${getCategoryColor(activity.category)}`}>
                      {activity.category}
                    </span>
                    {activity.status === 'open' && (
                      <span className="px-3 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full">
                        ✅ Open
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{activity.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{activity.description}</p>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">📍</span>
                      <span>{activity.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-lg mr-2">📅</span>
                      <span>{new Date(activity.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoinClick(activity)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white rounded-full font-bold hover:from-[#3A5531] hover:to-[#6C8A6F] transition-all transform hover:scale-105 shadow-lg"
                  >
                    🎉 Request to Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Request to Join Modal */}
        {showRequestModal && selectedActivity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#F5F1E8] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Request to Join Activity</h2>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="text-white hover:text-gray-200 text-3xl"
                >
                  ×
                </button>
              </div>

              {requestSuccess ? (
                <div className="p-8 text-center">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-green-600 mb-2">Request Submitted!</h3>
                  <p className="text-gray-600">Your request to join has been sent for review.</p>
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit} className="p-6 space-y-6">
                  <div className="bg-white p-4 rounded-xl border-2 border-[#7C9A7F]">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{selectedActivity.title}</h3>
                    <p className="text-sm text-gray-600">{selectedActivity.description}</p>
                  </div>

                  {requestError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {requestError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Why would you like to join this activity? *
                    </label>
                    <textarea
                      value={requestData.message}
                      onChange={(e) => setRequestData({ ...requestData, message: e.target.value })}
                      required
                      rows={4}
                      maxLength={1000}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6741] focus:border-transparent"
                      placeholder="Tell us why you're interested in participating..."
                    />
                    <p className="text-xs text-gray-500 mt-1">{requestData.message.length}/1000 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Your Availability *
                    </label>
                    <input
                      type="text"
                      value={requestData.availability}
                      onChange={(e) => setRequestData({ ...requestData, availability: e.target.value })}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6741] focus:border-transparent"
                      placeholder="e.g., Any time, Mornings only, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Any Special Requirements? (Optional)
                    </label>
                    <textarea
                      value={requestData.experience}
                      onChange={(e) => setRequestData({ ...requestData, experience: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6741] focus:border-transparent"
                      placeholder="Accessibility needs, dietary restrictions, etc..."
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowRequestModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white rounded-full font-bold hover:from-[#3A5531] hover:to-[#6C8A6F] transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
                    >
                      {submitting ? '⏳ Submitting...' : '🎉 Submit Request'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;
