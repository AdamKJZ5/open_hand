import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { getErrorMessage } from '../types/errors';
import { getJobPostingStatusColor } from '../utils/statusHelpers';

interface JobPosting {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary?: string;
  status: 'active' | 'closed';
  createdAt: string;
}

const ManageJobPostings = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'full-time' as 'full-time' | 'part-time' | 'contract',
    description: '',
    requirements: '',
    responsibilities: '',
    salary: '',
    status: 'active' as 'active' | 'closed'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user || JSON.parse(user).role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchJobs();
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      const response = await API.get('/jobs/postings');
      setJobs(response.data);
    } catch (err) {
      // Error fetching jobs
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      department: '',
      location: '',
      type: 'full-time',
      description: '',
      requirements: '',
      responsibilities: '',
      salary: '',
      status: 'active'
    });
    setShowModal(true);
    setError('');
  };

  const handleEdit = (job: JobPosting) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      description: job.description,
      requirements: job.requirements.join('\n'),
      responsibilities: job.responsibilities.join('\n'),
      salary: job.salary || '',
      status: job.status
    });
    setShowModal(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const jobData = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(r => r.trim()),
        responsibilities: formData.responsibilities.split('\n').filter(r => r.trim())
      };

      if (editingJob) {
        await API.put(`/jobs/postings/${editingJob._id}`, jobData);
      } else {
        await API.post('/jobs/postings', jobData);
      }

      await fetchJobs();
      setShowModal(false);
    } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Failed to save job posting');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (jobId: string) => {
    setJobToDelete(jobId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;

    try {
      await API.delete(`/jobs/postings/${jobToDelete}`);
      await fetchJobs();
      setShowDeleteModal(false);
      setJobToDelete(null);
    } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Failed to delete job posting');
      setShowDeleteModal(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'part-time': return 'bg-purple-100 text-[#3A5531] border-purple-200';
      case 'contract': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-[#4A6741]">Loading job postings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-[100px] pb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] bg-clip-text text-transparent">
            Manage Job Postings
          </h1>
          <button
            onClick={handleCreateNew}
            className="px-6 py-3 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white rounded-full font-bold hover:from-[#3A5531] hover:to-[#6C8A6F] transition-all transform hover:scale-105 shadow-lg"
          >
            + Create New Job
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-[#F5F1E8] rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">💼</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Job Postings Yet</h2>
            <p className="text-gray-600 mb-6">Create your first job posting to start receiving applications</p>
            <button
              onClick={handleCreateNew}
              className="px-6 py-3 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white rounded-full font-bold hover:from-[#3A5531] hover:to-[#6C8A6F] transition-all"
            >
              Create Job Posting
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="bg-[#F5F1E8] rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getJobPostingStatusColor(job.status)}`}>
                        {job.status.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getTypeColor(job.type)}`}>
                        {job.type.toUpperCase().replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600 mb-3">
                      <span className="font-medium">{job.department}</span>
                      <span>📍 {job.location}</span>
                      {job.salary && <span>💰 {job.salary}</span>}
                    </div>
                    <p className="text-gray-700 mb-2">{job.description.substring(0, 150)}...</p>
                    <div className="text-sm text-gray-500">
                      Posted: {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(job)}
                      className="px-4 py-2 bg-[#4A6741] text-white rounded-full font-semibold hover:bg-[#3A5531] transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#F5F1E8] rounded-2xl shadow-2xl max-w-3xl w-full p-8 my-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                {editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title*</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department*</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    placeholder="e.g., New York, NY"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Type*</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
                  >
                    <option value="full-time">Full-Time</option>
                    <option value="part-time">Part-Time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary (Optional)</label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="e.g., $50,000 - $70,000/year"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  placeholder="Describe the role and what makes it great..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements* (one per line)</label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  required
                  rows={4}
                  placeholder="Bachelor's degree in relevant field&#10;3+ years of experience&#10;Strong communication skills"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities* (one per line)</label>
                <textarea
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  required
                  rows={4}
                  placeholder="Provide direct care to residents&#10;Maintain accurate records&#10;Collaborate with team members"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white rounded-full font-semibold hover:from-[#3A5531] hover:to-[#6C8A6F] disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all"
                >
                  {submitting ? 'Saving...' : (editingJob ? 'Update Job' : 'Create Job')}
                </button>
              </div>
            </form>
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
                Are you sure you want to delete this job posting? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setJobToDelete(null);
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

export default ManageJobPostings;
