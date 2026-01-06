// Status badge color utilities

type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected';
type JobApplicationStatus = 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected';
type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
type JobStatus = 'active' | 'closed';

export const getApplicationStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewed: 'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getJobApplicationStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    reviewed: 'bg-blue-100 text-blue-700 border-blue-200',
    interview: 'bg-purple-100 text-[#3A5531] border-purple-200',
    accepted: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200'
  };
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
};

export const getOpportunityApplicationStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
    accepted: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200'
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getLeadStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    new: 'bg-blue-100 text-blue-700 border-blue-200',
    contacted: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    qualified: 'bg-purple-100 text-[#3A5531] border-purple-200',
    converted: 'bg-green-100 text-green-700 border-green-200',
    closed: 'bg-gray-100 text-gray-700 border-gray-200'
  };
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
};

export const getJobPostingStatusColor = (status: string): string => {
  return status === 'active'
    ? 'bg-green-100 text-green-700 border-green-200'
    : 'bg-gray-100 text-gray-700 border-gray-200';
};

export const getStatusEmoji = (status: string): string => {
  const emojis: { [key: string]: string } = {
    pending: '⏳',
    reviewed: '👀',
    accepted: '✅',
    rejected: '❌',
    new: '🆕',
    contacted: '📞',
    qualified: '⭐',
    converted: '✅',
    closed: '🔒',
    interview: '💼',
    active: '✅'
  };
  return emojis[status] || '📄';
};
