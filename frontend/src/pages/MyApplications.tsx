import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

interface Application {
  _id: string;
  opportunity: {
    _id: string;
    title: string;
    description: string;
    location: string;
    date: string;
    category: string;
    status: string;
  };
  message: string;
  availability: string;
  experience?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: string;
  reviewedBy?: {
    name: string;
  };
  adminNotes?: string;
}

const MyApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await API.get('/opportunity-applications/my-applications');
      setApplications(response.data.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusEmoji = (status: string) => {
    const emojis: { [key: string]: string } = {
      pending: '⏳',
      reviewed: '👀',
      accepted: '✅',
      rejected: '❌'
    };
    return emojis[status] || '📄';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Gardening': 'from-green-400 to-emerald-500',
      'Food': 'from-orange-400 to-red-500',
      'Education': 'from-blue-400 to-indigo-500',
      'Environment': 'from-teal-400 to-cyan-500',
      'Health': 'from-pink-400 to-rose-500',
      'Other': 'from-purple-400 to-pink-500'
    };
    return colors[category] || 'from-gray-400 to-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EDE7] to-[#F5F1E8] flex items-center justify-center">
        <div className="text-2xl font-bold text-[#4A6741]">✨ Loading your applications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/activities"
            className="inline-flex items-center text-[#4A6741] hover:text-purple-800 font-semibold mb-4"
          >
            ← Back to Activities
          </Link>
          <h1 className="text-5xl font-black bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] bg-clip-text text-transparent mb-4">
            🎨 My Activities
          </h1>
          <p className="text-xl text-gray-700">
            Track your activity registrations and participation
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-20 bg-[#F5F1E8] rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Activities Yet</h2>
            <p className="text-gray-600 mb-6">You haven't signed up for any activities yet.</p>
            <Link
              to="/activities"
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white rounded-full font-bold hover:from-[#3A5531] hover:to-[#6C8A6F] transition-all transform hover:scale-105 shadow-lg"
            >
              Browse Activities
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-[#F5F1E8] rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all"
              >
                <div className={`h-2 bg-gradient-to-r ${getCategoryColor(app.opportunity.category)}`}></div>
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r ${getCategoryColor(app.opportunity.category)}`}>
                          {app.opportunity.category}
                        </span>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(app.status)}`}>
                          {getStatusEmoji(app.status)} {app.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{app.opportunity.title}</h3>
                      <p className="text-gray-600 mb-3">{app.opportunity.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <span className="mr-2">📍</span>
                          <span>{app.opportunity.location}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">📅</span>
                          <span>{new Date(app.opportunity.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">⏰</span>
                          <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="border-t pt-4 space-y-3">
                    <div>
                      <h4 className="text-sm font-bold text-gray-700 mb-1">Your Message:</h4>
                      <p className="text-gray-600 text-sm">{app.message}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-1">Availability:</h4>
                        <p className="text-gray-600 text-sm">{app.availability}</p>
                      </div>
                      {app.experience && (
                        <div>
                          <h4 className="text-sm font-bold text-gray-700 mb-1">Experience:</h4>
                          <p className="text-gray-600 text-sm">{app.experience}</p>
                        </div>
                      )}
                    </div>

                    {/* Admin Feedback */}
                    {app.adminNotes && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center">
                          <span className="mr-2">💬</span>
                          Admin Feedback
                        </h4>
                        <p className="text-blue-800 text-sm">{app.adminNotes}</p>
                        {app.reviewedBy && (
                          <p className="text-xs text-[#4A6741] mt-2">
                            — Reviewed by {app.reviewedBy.name}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Acceptance Message */}
                    {app.status === 'accepted' && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <p className="text-green-800 font-semibold text-sm flex items-center">
                          <span className="text-2xl mr-2">🎉</span>
                          Congratulations! Your application has been accepted. Someone from our team will contact you soon with next steps.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
