import { useEffect, useState } from 'react';
import API from '../api';

interface Application {
  _id: string;
  opportunity: {
    _id: string;
    title: string;
    category: string;
    location: string;
    date: string;
  };
  applicant: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  message: string;
  availability: string;
  experience?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: string;
  adminNotes?: string;
  reviewedBy?: {
    name: string;
  };
}

const ManageOpportunityApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [filterStatus]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = filterStatus !== 'all' ? { status: filterStatus } : {};
      const response = await API.get('/opportunity-applications', { params });
      setApplications(response.data.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = (app: Application) => {
    setSelectedApp(app);
    setAdminNotes(app.adminNotes || '');
    setShowModal(true);
  };

  const handleUpdateStatus = async (newStatus: 'reviewed' | 'accepted' | 'rejected') => {
    if (!selectedApp) return;

    setUpdatingStatus(true);
    try {
      await API.put(`/opportunity-applications/${selectedApp._id}/status`, {
        status: newStatus,
        adminNotes
      });
      await fetchApplications();
      setShowModal(false);
      alert('Application status updated successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
      accepted: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
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

  if (loading && applications.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EDE7] to-[#F5F1E8] flex items-center justify-center">
        <div className="text-2xl font-bold text-[#4A6741]">✨ Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-black bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] bg-clip-text text-transparent mb-4">
            🎨 Manage Activity Registrations
          </h1>
          <p className="text-xl text-gray-700">Review and manage resident activity participation requests</p>
        </div>

        {/* Filters */}
        <div className="bg-[#F5F1E8] rounded-2xl shadow-lg p-6 mb-8">
          <label className="block text-sm font-bold text-gray-700 mb-3">Filter by Status:</label>
          <div className="flex flex-wrap gap-3">
            {['all', 'pending', 'reviewed', 'accepted', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105 ${
                  filterStatus === status
                    ? 'bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-4xl mb-2">⏳</div>
            <div className="text-3xl font-black">{applications.filter(a => a.status === 'pending').length}</div>
            <div className="text-sm opacity-90">Pending</div>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-4xl mb-2">👀</div>
            <div className="text-3xl font-black">{applications.filter(a => a.status === 'reviewed').length}</div>
            <div className="text-sm opacity-90">Reviewed</div>
          </div>
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-black">{applications.filter(a => a.status === 'accepted').length}</div>
            <div className="text-sm opacity-90">Accepted</div>
          </div>
          <div className="bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-4xl mb-2">❌</div>
            <div className="text-3xl font-black">{applications.filter(a => a.status === 'rejected').length}</div>
            <div className="text-sm opacity-90">Rejected</div>
          </div>
        </div>

        {/* Applications Table */}
        {applications.length === 0 ? (
          <div className="bg-[#F5F1E8] rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-600">No applications found</p>
          </div>
        ) : (
          <div className="bg-[#F5F1E8] rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-purple-100 to-pink-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Availability
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#F5F1E8] divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-[#E8EDE7] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{app.applicant.name}</div>
                        <div className="text-sm text-gray-500">{app.applicant.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{app.opportunity.title}</div>
                        <div className="text-xs text-gray-500">{app.opportunity.category}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{app.availability}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full border-2 ${getStatusColor(app.status)}`}>
                          {getStatusEmoji(app.status)} {app.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewApplication(app)}
                          className="text-[#4A6741] hover:text-purple-900 font-semibold"
                        >
                          View Details →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Application Details Modal */}
        {showModal && selectedApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#F5F1E8] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Activity Registration Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-gray-200 text-3xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Applicant Info */}
                <div className="bg-gradient-to-r from-[#E8EDE7] to-[#F5F1E8] p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">👤 Applicant Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold text-gray-900">{selectedApp.applicant.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-900">{selectedApp.applicant.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Role</p>
                      <p className="font-semibold text-gray-900 capitalize">{selectedApp.applicant.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Current Status</p>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border-2 ${getStatusColor(selectedApp.status)}`}>
                        {getStatusEmoji(selectedApp.status)} {selectedApp.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activity Info */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">🎨 Activity</h3>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-2">{selectedApp.opportunity.title}</h4>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>📍 {selectedApp.opportunity.location}</span>
                      <span>📅 {new Date(selectedApp.opportunity.date).toLocaleDateString()}</span>
                      <span className="px-2 py-1 bg-purple-100 text-[#3A5531] rounded text-xs font-semibold">
                        {selectedApp.opportunity.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Registration Details */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">📝 Registration Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Message:</p>
                      <p className="text-gray-900 bg-gray-50 p-4 rounded-xl">{selectedApp.message}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Availability:</p>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-xl">{selectedApp.availability}</p>
                      </div>
                      {selectedApp.experience && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">Experience:</p>
                          <p className="text-gray-900 bg-gray-50 p-3 rounded-xl">{selectedApp.experience}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">💬 Admin Notes</h3>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
                    placeholder="Add notes about this application..."
                  />
                </div>

                {/* Status Update Actions */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Update Status</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleUpdateStatus('reviewed')}
                      disabled={updatingStatus}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-bold hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 disabled:opacity-50"
                    >
                      👀 Mark as Reviewed
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('accepted')}
                      disabled={updatingStatus}
                      className="px-6 py-3 bg-gradient-to-r from-[#7C9A7F] to-[#5A7A5F] text-white rounded-full font-bold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50"
                    >
                      ✅ Accept
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('rejected')}
                      disabled={updatingStatus}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full font-bold hover:from-red-600 hover:to-[#6C8A6F] transition-all transform hover:scale-105 disabled:opacity-50"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOpportunityApplications;
