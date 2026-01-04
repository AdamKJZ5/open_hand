import { useState, useEffect } from 'react';
import API from '../api';

interface Application {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  careLevel: string;
  status: string;
  preferredMoveInDate: string;
  mobilityLevel: string;
  createdAt: string;
}

const ManageApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, [filterStatus]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = filterStatus !== 'all' ? { status: filterStatus } : {};
      const response = await API.get('/resident-applications', { params });
      setApplications(response.data.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = async (appId: string) => {
    try {
      const response = await API.get(`/resident-applications/${appId}`);
      setSelectedApp(response.data.data);
      setShowDetails(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch application details');
    }
  };

  const updateStatus = async (appId: string, newStatus: string) => {
    if (!window.confirm(`Change status to ${newStatus}?`)) return;

    try {
      await API.put(`/resident-applications/${appId}/status`, { status: newStatus });
      await fetchApplications();
      if (selectedApp?._id === appId) {
        setShowDetails(false);
        setSelectedApp(null);
      }
      alert('Status updated successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const deleteApplication = async (appId: string) => {
    if (!window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) return;

    try {
      await API.delete(`/resident-applications/${appId}`);
      await fetchApplications();
      if (selectedApp?._id === appId) {
        setShowDetails(false);
        setSelectedApp(null);
      }
      alert('Application deleted successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete application');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      under_review: 'bg-blue-100 text-blue-800 border border-blue-200',
      approved: 'bg-green-100 text-green-800 border border-green-200',
      rejected: 'bg-red-100 text-red-800 border border-red-200',
      waitlisted: 'bg-purple-100 text-purple-800 border border-purple-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && applications.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
        <div className="text-2xl font-bold text-[#4A6741]">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] bg-clip-text text-transparent mb-2">Manage Applications</h1>
          <p className="text-gray-700 text-lg font-medium">Review and manage resident applications</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-[#F5F1E8] rounded-2xl shadow-lg p-6 mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-3">
            Filter by Status:
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6741] focus:border-[#4A6741] font-medium"
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="waitlisted">Waitlisted</option>
          </select>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="bg-[#F5F1E8] rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Applications Found</h2>
            <p className="text-gray-600">Applications matching your filter will appear here</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-[#F5F1E8] rounded-2xl shadow-xl overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-[#4A6741] to-[#7C9A7F]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Care Level
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Move-In Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#F5F1E8] divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {app.firstName} {app.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.email}</div>
                      <div className="text-sm text-gray-500">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {app.careLevel.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(app.preferredMoveInDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(app.status)}`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => viewDetails(app._id)}
                        className="px-4 py-2 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white rounded-lg font-semibold hover:from-[#3A5531] hover:to-[#6C8A6F] transition-all mr-2"
                      >
                        View
                      </button>
                      <button
                        onClick={() => deleteApplication(app._id)}
                        className="px-4 py-2 bg-gradient-to-r from-[#8B6F47] to-[#7C6347] text-white rounded-lg font-semibold hover:from-[#7C6347] hover:to-[#6B5437] transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="bg-[#F5F1E8] rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {app.firstName} {app.lastName}
                    </h3>
                    <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusBadgeColor(app.status)}`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 w-32">Email:</span>
                    <span className="text-gray-900">{app.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 w-32">Phone:</span>
                    <span className="text-gray-900">{app.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 w-32">Care Level:</span>
                    <span className="text-gray-900 capitalize">{app.careLevel.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 w-32">Move-In Date:</span>
                    <span className="text-gray-900">{formatDate(app.preferredMoveInDate)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 w-32">Submitted:</span>
                    <span className="text-gray-500">{formatDate(app.createdAt)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => viewDetails(app._id)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white rounded-xl font-semibold hover:from-[#3A5531] hover:to-[#6C8A6F] transition-all"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => deleteApplication(app._id)}
                    className="px-4 py-3 bg-gradient-to-r from-[#8B6F47] to-[#7C6347] text-white rounded-xl font-semibold hover:from-[#7C6347] hover:to-[#6B5437] transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          </>
        )}

        {/* Details Modal */}
        {showDetails && selectedApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#F5F1E8] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] border-b px-6 py-6 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-3xl font-bold text-white">
                  Application Details
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Personal Information */}
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="text-sm font-medium">{selectedApp.firstName} {selectedApp.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-sm font-medium">{selectedApp.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-sm font-medium">{selectedApp.phone}</p>
                    </div>
                  </div>
                </section>

                {/* Care Information */}
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
                    Care Requirements
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Care Level</p>
                      <p className="text-sm font-medium capitalize">{selectedApp.careLevel.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mobility Level</p>
                      <p className="text-sm font-medium capitalize">{selectedApp.mobilityLevel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Preferred Move-In Date</p>
                      <p className="text-sm font-medium">{formatDate(selectedApp.preferredMoveInDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current Status</p>
                      <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusBadgeColor(selectedApp.status)}`}>
                        {selectedApp.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </section>

                {/* Status Update Actions */}
                <section className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Update Application Status
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => updateStatus(selectedApp._id, 'under_review')}
                      className="px-6 py-3 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white rounded-xl font-semibold hover:from-[#3A5531] hover:to-[#6C8A6F] transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Under Review
                    </button>
                    <button
                      onClick={() => updateStatus(selectedApp._id, 'approved')}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(selectedApp._id, 'rejected')}
                      className="px-6 py-3 bg-gradient-to-r from-[#8B6F47] to-[#7C6347] text-white rounded-xl font-semibold hover:from-[#7C6347] hover:to-[#6B5437] transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => updateStatus(selectedApp._id, 'waitlisted')}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Waitlist
                    </button>
                  </div>
                </section>
              </div>

              <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t rounded-b-2xl">
                <button
                  onClick={() => setShowDetails(false)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageApplications;
