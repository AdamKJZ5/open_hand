import { useEffect, useState } from 'react';
import API from '../api';

interface Lead {
  _id: string;
  clientName: string;
  contactEmail: string;
  phoneNumber: string;
  serviceNeeded: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
}

const ManageLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await API.get('/leads');
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = filterStatus === 'all'
    ? leads
    : leads.filter(lead => lead.status === filterStatus);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      new: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      contacted: 'bg-blue-100 text-blue-800 border-blue-200',
      closed: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusEmoji = (status: string) => {
    const emojis: { [key: string]: string } = {
      new: '🆕',
      contacted: '📞',
      closed: '✅'
    };
    return emojis[status] || '📄';
  };

  const getServiceEmoji = (service: string) => {
    const emojis: { [key: string]: string } = {
      'Home Care': '🏠',
      'Companion Ship': '👥',
      'Nursing': '⚕️',
      'Other': '📋'
    };
    return emojis[service] || '📋';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-[#4A6741]">✨ Loading leads...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-black bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] bg-clip-text text-transparent mb-4">
            📞 Manage Leads
          </h1>
          <p className="text-xl text-gray-700">View and manage customer inquiries</p>
        </div>

        {/* Filters */}
        <div className="bg-[#F5F1E8] rounded-2xl shadow-lg p-6 mb-8">
          <label className="block text-sm font-bold text-gray-700 mb-3">Filter by Status:</label>
          <div className="flex flex-wrap gap-3">
            {['all', 'new', 'contacted', 'closed'].map((status) => (
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-4xl mb-2">🆕</div>
            <div className="text-3xl font-black">{leads.filter(l => l.status === 'new').length}</div>
            <div className="text-sm opacity-90">New Leads</div>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-4xl mb-2">📞</div>
            <div className="text-3xl font-black">{leads.filter(l => l.status === 'contacted').length}</div>
            <div className="text-sm opacity-90">Contacted</div>
          </div>
          <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-black">{leads.filter(l => l.status === 'closed').length}</div>
            <div className="text-sm opacity-90">Closed</div>
          </div>
        </div>

        {/* Leads Table */}
        {filteredLeads.length === 0 ? (
          <div className="bg-[#F5F1E8] rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-600">No leads found</p>
          </div>
        ) : (
          <div className="bg-[#F5F1E8] rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-purple-100 to-pink-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Received
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#F5F1E8] divide-y divide-gray-200">
                  {filteredLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-[#E8EDE7] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{lead.clientName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{lead.contactEmail}</div>
                        <div className="text-xs text-gray-500">{lead.phoneNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {getServiceEmoji(lead.serviceNeeded)} {lead.serviceNeeded}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full border-2 ${getStatusColor(lead.status)}`}>
                          {getStatusEmoji(lead.status)} {lead.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setShowModal(true);
                          }}
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

        {/* Lead Details Modal */}
        {showModal && selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#F5F1E8] rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Lead Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-gray-200 text-3xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Client Info */}
                <div className="bg-gradient-to-r from-[#E8EDE7] to-[#F5F1E8] p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">👤 Client Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold text-gray-900">{selectedLead.clientName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border-2 ${getStatusColor(selectedLead.status)}`}>
                        {getStatusEmoji(selectedLead.status)} {selectedLead.status.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-900">{selectedLead.contactEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-900">{selectedLead.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Service Needed</p>
                      <p className="font-semibold text-gray-900">
                        {getServiceEmoji(selectedLead.serviceNeeded)} {selectedLead.serviceNeeded}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Received</p>
                      <p className="font-semibold text-gray-900">{new Date(selectedLead.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">💬 Message</h3>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-xl whitespace-pre-wrap">{selectedLead.message}</p>
                </div>

                {/* Quick Actions */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Contact</h3>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`tel:${selectedLead.phoneNumber}`}
                      className="px-6 py-3 bg-gradient-to-r from-[#7C9A7F] to-[#5A7A5F] text-white rounded-full font-bold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
                    >
                      📞 Call {selectedLead.clientName}
                    </a>
                    <a
                      href={`mailto:${selectedLead.contactEmail}?subject=Re: Your Inquiry at OpenHand Care`}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-bold hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105"
                    >
                      📧 Send Email
                    </a>
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

export default ManageLeads;
