import { useState } from 'react';
import API from '../api';
import { getErrorMessage } from '../types/errors';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    contactEmail: '',
    phoneNumber: '',
    serviceNeeded: 'Home Care',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await API.post('/leads/contact', formData);
      setSuccess(true);
      setFormData({
        clientName: '',
        contactEmail: '',
        phoneNumber: '',
        serviceNeeded: 'Home Care',
        message: ''
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Failed to send inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 pt-[100px] pb-16 md:pb-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] bg-clip-text text-transparent mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-700 font-medium">
            Have questions about our services? We're here to help!
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          <div className="bg-[#F5F1E8] rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all">
            <div className="text-4xl mb-3">📞</div>
            <h3 className="font-bold text-gray-900 mb-2">Call Us</h3>
            <a href="tel:+14257899091" className="text-gray-600 hover:text-[#4A6741] transition-colors">
              (425) 789-9091
            </a>
          </div>
          <div className="bg-[#F5F1E8] rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all">
            <div className="text-4xl mb-3">📧</div>
            <h3 className="font-bold text-gray-900 mb-2">Email Us</h3>
            <a href="mailto:Openhandafh@gmail.com" className="text-gray-600 hover:text-[#4A6741] transition-colors">
              Openhandafh@gmail.com
            </a>
          </div>
          <div className="bg-[#F5F1E8] rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all">
            <div className="text-4xl mb-3">📍</div>
            <h3 className="font-bold text-gray-900 mb-2">Visit Us</h3>
            <a
              href="https://maps.google.com/?q=16015+NE+2nd+Street,+Bellevue,+WA+98007"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#4A6741] transition-colors"
            >
              16015 NE 2nd Street<br />Bellevue, WA 98007
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-2 border-[#7C9A7F]">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
            <p className="text-gray-600 mb-8">Fill out the form below and our team will get back to you within 24 hours.</p>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl mb-6 flex items-center">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <p className="font-bold">Thank you for contacting us!</p>
                <p className="text-sm">We'll reach out to you soon.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="flex flex-col items-center">
              <label className="block text-sm font-bold text-gray-700 mb-2 w-full max-w-md">
                Your Name *
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                required
                className="w-full max-w-md px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6741] focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col items-center">
              <label className="block text-sm font-bold text-gray-700 mb-2 w-full max-w-md">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                required
                className="w-full max-w-md px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6741] focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col items-center">
              <label className="block text-sm font-bold text-gray-700 mb-2 w-full max-w-md">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
                className="w-full max-w-md px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6741] focus:border-transparent"
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Service Needed */}
            <div className="flex flex-col items-center">
              <label className="block text-sm font-bold text-gray-700 mb-2 w-full max-w-md">
                Service Needed *
              </label>
              <select
                value={formData.serviceNeeded}
                onChange={(e) => setFormData({ ...formData, serviceNeeded: e.target.value })}
                required
                className="w-full max-w-md px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6741] focus:border-transparent"
              >
                <option value="Home Care">Home Care</option>
                <option value="Companion Ship">Companion Ship</option>
                <option value="Nursing">Nursing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div className="flex flex-col items-center">
              <label className="block text-sm font-bold text-gray-700 mb-2 w-full max-w-md">
                Your Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={6}
                className="w-full max-w-md px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6741] focus:border-transparent"
                placeholder="Tell us about your care needs or any questions you have..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={submitting}
                className="w-full max-w-md px-8 py-4 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white rounded-full font-bold text-lg hover:from-[#3A5531] hover:to-[#6C8A6F] transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '📤 Sending...' : '📤 Send Message'}
              </button>
            </div>
          </form>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 max-w-5xl mx-auto bg-gradient-to-r from-[#E8EDE7] to-[#F5F1E8] rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">🕒 Business Hours</h3>
          <p className="text-gray-700 text-lg">Monday - Friday: 8:00 AM - 6:00 PM</p>
          <p className="text-gray-700 text-lg">Saturday: 9:00 AM - 4:00 PM</p>
          <p className="text-gray-700 text-lg">Sunday: Closed</p>
          <p className="text-gray-600 mt-4 text-sm">*24/7 emergency support available for current residents</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
