import { useState, useEffect } from 'react';
import API from '../api';
import { getErrorMessage } from '../types/errors';

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
  status: string;
  createdAt: string;
}

const Careers = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    coverLetter: '',
    experience: '',
    availability: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
    // Pre-fill user info if logged in
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setFormData(prev => ({
          ...prev,
          fullName: user.name || '',
          email: user.email || ''
        }));
      } catch (err) {
        // Silently handle parsing error
      }
    }

    // Check if user just registered/logged in and has a pending job application
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('jobId');
    const pendingJobId = localStorage.getItem('pendingJobApplication');

    if (jobId && pendingJobId && jobId === pendingJobId) {
      // Clear the pending application flag
      localStorage.removeItem('pendingJobApplication');
      // Fetch the job and open the application modal
      setTimeout(() => {
        const job = jobs.find(j => j._id === jobId);
        if (job) {
          setSelectedJob(job);
          setShowApplicationModal(true);
        }
      }, 500); // Small delay to ensure jobs are loaded
    }
  }, [jobs]);

  const fetchJobs = async () => {
    try {
      const response = await API.get('/jobs/postings/active');
      setJobs(response.data);
    } catch (err) {
      // Error fetching jobs - silently fail
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (job: JobPosting) => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Store the job ID to return to after registration/login
      localStorage.setItem('pendingJobApplication', job._id);
      // Redirect to register page with return URL
      window.location.href = `/register?returnTo=/careers&jobId=${job._id}`;
      return;
    }
    setSelectedJob(job);
    setShowApplicationModal(true);
    setMessage('');
    setError('');
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      await API.post(`/jobs/postings/${selectedJob._id}/apply`, formData);
      setMessage('Application submitted successfully!');
      setFormData({
        ...formData,
        coverLetter: '',
        experience: '',
        availability: ''
      });
      setTimeout(() => {
        setShowApplicationModal(false);
        setMessage('');
      }, 2000);
    } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-green-100 text-green-700 border-green-200';
      case 'part-time': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'contract': return 'bg-purple-100 text-[#3A5531] border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
        <div className="text-2xl font-bold text-[#4A6741]">Loading career opportunities...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-[100px] pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] bg-clip-text text-transparent mb-4">
            Join Our Team
          </h1>
          <p className="text-2xl text-gray-700 font-medium">
            Make a difference in people's lives at OpenHand Care
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-[#F5F1E8] rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">💼</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Openings Right Now</h2>
            <p className="text-gray-600">
              We don't have any open positions at the moment, but check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job._id} className="bg-[#F5F1E8] rounded-2xl shadow-lg hover:shadow-xl transition-all p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h2>
                    <div className="flex flex-wrap gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getJobTypeColor(job.type)}`}>
                        {job.type.toUpperCase().replace('-', ' ')}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-700 border border-gray-200">
                        {job.department}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-700 border border-gray-200">
                        📍 {job.location}
                      </span>
                      {job.salary && (
                        <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700 border border-green-200">
                          💰 {job.salary}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">About the Role</h3>
                    <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                  </div>

                  {job.responsibilities.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Responsibilities</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {job.responsibilities.map((resp, index) => (
                          <li key={index} className="text-gray-700">{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {job.requirements.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Requirements</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="text-gray-700">{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleApplyClick(job)}
                  className="w-full py-4 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white rounded-full font-bold hover:from-[#3A5531] hover:to-[#6C8A6F] transition-all transform hover:scale-105 shadow-lg"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#F5F1E8] rounded-2xl shadow-2xl max-w-2xl w-full p-8 my-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Apply for {selectedJob.title}</h2>
                <p className="text-gray-600">{selectedJob.department} • {selectedJob.location}</p>
              </div>
              <button
                onClick={() => setShowApplicationModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {message && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="text-sm text-green-700">{message}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter*</label>
                <textarea
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  required
                  rows={4}
                  placeholder="Tell us why you're interested in this position..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relevant Experience*</label>
                <textarea
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  required
                  rows={4}
                  placeholder="Describe your relevant experience..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability*</label>
                <input
                  type="text"
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  required
                  placeholder="e.g., Immediately, Two weeks notice, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowApplicationModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white rounded-full font-semibold hover:from-[#3A5531] hover:to-[#6C8A6F] disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
