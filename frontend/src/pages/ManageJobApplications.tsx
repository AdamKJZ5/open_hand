import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { getErrorMessage } from '../types/errors';
import { getJobApplicationStatusColor } from '../utils/statusHelpers';

interface JobPosting {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
}

interface JobApplication {
  _id: string;
  jobPosting: JobPosting;
  applicant: {
    _id: string;
    name: string;
    email: string;
  };
  fullName: string;
  email: string;
  phoneNumber: string;
  coverLetter: string;
  experience: string;
  availability: string;
  status: 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected';
  adminNotes?: string;
  createdAt: string;
}

const ManageJobApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState<string>('');
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user || JSON.parse(user).role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchApplications();
  }, [navigate, statusFilter]);

  const fetchApplications = async () => {
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await API.get('/jobs/applications', { params });
      setApplications(response.data);
    } catch (err) {
      // Error fetching applications
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (application: JobApplication) => {
    setSelectedApplication(application);
    setNewStatus(application.status);
    setAdminNotes(application.adminNotes || '');
    setError('');
    setShowDetailModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedApplication) return;

    setError('');
    try {
      await API.put(`/jobs/applications/${selectedApplication._id}/status`, {
        status: newStatus,
        adminNotes
      });
      await fetchApplications();
      setShowDetailModal(false);
    } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Failed to update application');
    }
  };

  const handleDelete = (applicationId: string) => {
    setApplicationToDelete(applicationId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!applicationToDelete) return;

    try {
      await API.delete(`/jobs/applications/${applicationToDelete}`);
      await fetchApplications();
      if (showDetailModal) {
        setShowDetailModal(false);
      }
      setShowDeleteModal(false);
      setApplicationToDelete(null);
    } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Failed to delete application');
      setShowDeleteModal(false);
    }
  };


  const statusCounts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    reviewed: applications.filter(a => a.status === 'reviewed').length,
    interview: applications.filter(a => a.status === 'interview').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-[#4A6741]">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-[100px] pb-12">
        <h1 className="text-4xl font-black bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] bg-clip-text text-transparent mb-8">
          Manage Job Applications
        </h1>

        {/* Filter Tabs */}
        <div className="bg-[#F5F1E8] rounded-2xl shadow-lg p-2 mb-8 flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Applications' },
            { key: 'pending', label: 'Pending' },
            { key: 'reviewed', label: 'Reviewed' },
            { key: 'interview', label: 'Interview' },
            { key: 'accepted', label: 'Accepted' },
            { key: 'rejected', label: 'Rejected' }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setStatusFilter(filter.key)}
              className={`px-4 py-2 rounded-full font-semibold transition-all ${
                statusFilter === filter.key
                  ? 'bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter.label} ({(statusCounts as any)[filter.key]})
            </button>
          ))}
        </div>

        {applications.length === 0 ? (
          <div className="bg-[#F5F1E8] rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Applications Yet</h2>
            <p className="text-gray-600">Job applications will appear here once candidates start applying</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div key={application._id} className="bg-[#F5F1E8] rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">{application.fullName}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getJobApplicationStatusColor(application.status)}`}>
                        {application.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-1 mb-3">
                      <p className="text-lg font-semibold text-[#4A6741]">{application.jobPosting.title}</p>
                      <p className="text-sm text-gray-600">{application.jobPosting.department} • {application.jobPosting.location}</p>
                      <p className="text-sm text-gray-600">📧 {application.email}</p>
                      <p className="text-sm text-gray-600">📱 {application.phoneNumber}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Applied: {new Date(application.createdAt).toLocaleDateString()} at {new Date(application.createdAt).toLocaleTimeString()}
                    </div>
                    {application.adminNotes && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-semibold text-blue-900 mb-1">Admin Notes:</p>
                        <p className="text-sm text-blue-700">{application.adminNotes}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleViewDetails(application)}
                      className="px-4 py-2 bg-[#4A6741] text-white rounded-full font-semibold hover:bg-[#3A5531] transition-all"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDelete(application._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#F5F1E8] rounded-2xl shadow-2xl max-w-4xl w-full p-8 my-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedApplication.fullName}</h2>
                <p className="text-lg text-[#4A6741] font-semibold">{selectedApplication.jobPosting.title}</p>
                <p className="text-sm text-gray-600">
                  {selectedApplication.jobPosting.department} • {selectedApplication.jobPosting.location}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-gray-900">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Phone Number</p>
                    <p className="text-gray-900">{selectedApplication.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Availability</p>
                    <p className="text-gray-900">{selectedApplication.availability}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Applied On</p>
                    <p className="text-gray-900">{new Date(selectedApplication.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Cover Letter</h3>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-700 whitespace-pre-line">{selectedApplication.coverLetter}</p>
                </div>
              </div>

              {/* Experience */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Relevant Experience</h3>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-700 whitespace-pre-line">{selectedApplication.experience}</p>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Update Application Status</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="interview">Interview</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={3}
                      placeholder="Add notes about this application..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
                    />
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white rounded-full font-semibold hover:from-[#3A5531] hover:to-[#6C8A6F] transition-all"
                >
                  Update Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F5F1E8] rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirm Deletion</h2>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this application? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setApplicationToDelete(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-bold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobApplications;
