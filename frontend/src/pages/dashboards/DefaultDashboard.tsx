import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const DefaultDashboard = () => {
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || 'User');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Welcome to OpenHand Care!
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700">Hi {userName}, welcome to the community!</p>
        </div>

        {/* Main Status Card */}
        <div className="bg-[#F5F1E8] rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center">
            <div className="inline-block p-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-6 shadow-xl">
              <div className="text-6xl">🌟</div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to the Community</h2>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for joining OpenHand Care! Explore our community and discover everything we have to offer.
            </p>
          </div>

          {/* Account Info */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">👤</span>
              Your Account Info
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Name</span>
                <span className="font-semibold text-gray-900">{userName}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Status</span>
                <span className="px-3 py-1 bg-purple-100 text-[#3A5531] text-sm font-bold rounded-full">Community Member</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
          <Link
            to="/activities"
            className="bg-gradient-to-br from-[#5A7A5F] to-[#7C9A7F] rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="text-xl font-bold mb-2">Browse Activities</h3>
            <p className="text-white/90 text-sm">See what's happening</p>
          </Link>
          <Link
            to="/our-homes"
            className="bg-gradient-to-br from-[#7C9A7F] to-[#5A7A5F] rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <div className="text-4xl mb-3">🏡</div>
            <h3 className="text-xl font-bold mb-2">Our Homes</h3>
            <p className="text-white/90 text-sm">Virtual tour</p>
          </Link>
          <Link
            to="/careers"
            className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <div className="text-4xl mb-3">💼</div>
            <h3 className="text-xl font-bold mb-2">Careers</h3>
            <p className="text-white/90 text-sm">Join our team</p>
          </Link>
          <Link
            to="/apply"
            className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-xl font-bold mb-2">Apply for Residency</h3>
            <p className="text-white/90 text-sm">Become a resident</p>
          </Link>
        </div>

        {/* Contact Information */}
        <div className="bg-[#F5F1E8] rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-3xl mr-2">📧</span>
            Need Help?
          </h2>
          <p className="text-gray-600 mb-4">
            If you have any questions or need assistance, please don't hesitate to contact us:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-bold text-gray-900">
                <a href="mailto:Openhandafh@gmail.com" className="hover:text-[#4A6741]">Openhandafh@gmail.com</a>
              </p>
            </div>
            <div className="bg-gradient-to-r from-[#E8EDE7] to-[#F5F1E8] p-4 rounded-xl border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Phone</p>
              <p className="font-bold text-gray-900">
                <a href="tel:+14257899091" className="hover:text-[#4A6741]">(425) 789-9091</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultDashboard;
