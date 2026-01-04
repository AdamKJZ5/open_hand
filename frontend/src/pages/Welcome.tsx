import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || '');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="p-5 bg-gradient-to-r from-[#4A6741] via-[#5A7A5F] to-[#7C9A7F] rounded-full shadow-2xl">
              <div className="text-6xl">🎉</div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] bg-clip-text text-transparent mb-4">
            Welcome to OpenHand Care{userName ? `, ${userName}` : ''}!
          </h1>
          <p className="text-xl text-gray-700 font-medium mb-6">
            Your account has been successfully created
          </p>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-3 bg-[#F5F1E8] rounded-full px-6 py-3 shadow-lg border-2 border-purple-200">
            <span className="text-sm font-bold text-gray-600">STATUS:</span>
            <span className="px-4 py-1 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white rounded-full text-sm font-bold">
              Community Member
            </span>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="bg-[#F5F1E8] rounded-2xl shadow-xl p-8 md:p-12 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">
            What's Next?
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Explore everything our community has to offer
          </p>

          {/* Explore Our Community Cards */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              🌟 Explore Our Community
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Activities Card */}
              <Link
                to="/activities"
                className="bg-gradient-to-br from-[#5A7A5F] to-[#7C9A7F] rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🎨</div>
                <h3 className="text-xl font-bold mb-2">Activities & Events</h3>
                <p className="text-white/90 text-sm mb-4">
                  Join gardening, art classes, fitness programs, and more!
                </p>
                <div className="flex items-center text-sm font-semibold">
                  Explore Activities →
                </div>
              </Link>

              {/* Our Homes Card */}
              <Link
                to="/our-homes"
                className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🏡</div>
                <h3 className="text-xl font-bold mb-2">Our Homes</h3>
                <p className="text-white/90 text-sm mb-4">
                  Tour our beautiful facilities and care environments
                </p>
                <div className="flex items-center text-sm font-semibold">
                  View Homes →
                </div>
              </Link>

              {/* Careers Card */}
              <Link
                to="/careers"
                className="bg-gradient-to-br from-[#7C9A7F] to-[#5A7A5F] rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💼</div>
                <h3 className="text-xl font-bold mb-2">Career Opportunities</h3>
                <p className="text-white/90 text-sm mb-4">
                  Join our team and make a difference in people's lives
                </p>
                <div className="flex items-center text-sm font-semibold">
                  View Careers →
                </div>
              </Link>
            </div>
          </div>

          {/* Additional Quick Actions */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/apply"
                className="bg-gradient-to-r from-[#E8EDE7] to-[#F5F1E8] rounded-xl p-5 border-2 border-purple-200 hover:border-purple-400 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">📝</div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-[#4A6741] transition-colors">
                      Apply for Resident Care
                    </h4>
                    <p className="text-sm text-gray-600">
                      Start your application for care services
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/contact"
                className="bg-gradient-to-r from-[#E8EDE7] to-[#F5F1E8] rounded-xl p-5 border-2 border-purple-200 hover:border-purple-400 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">📞</div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-[#4A6741] transition-colors">
                      Contact Us
                    </h4>
                    <p className="text-sm text-gray-600">
                      Have questions? We're here to help!
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Continue to Dashboard Button */}
        <div className="text-center">
          <Link
            to="/dashboard"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white rounded-full font-bold text-lg hover:from-[#3A5531] hover:to-[#6C8A6F] transition-all transform hover:scale-105 shadow-lg"
          >
            Continue to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
