import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // Get user role
  const getUserRole = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.role || '';
      } catch (error) {
        return '';
      }
    }
    return '';
  };

  const userRole = getUserRole();
  const isAdmin = userRole === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-br from-[#4A6741] via-[#5A7A5F] to-[#7C9A7F] text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20 relative">
          {/* Logo - left of center */}
          <div className="absolute left-[30%] transform -translate-x-1/2 text-2xl font-bold">
            <span className="text-white visited:text-white active:text-white focus:text-white no-underline">
              OpenHand Care
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2 ml-auto">
            <Link
              to="/"
              className="px-4 py-2 rounded-full hover:bg-white/20 backdrop-blur-sm transition-all font-medium hover:scale-105 text-white visited:text-white active:text-white focus:text-white no-underline"
            >
              Home
            </Link>

            <Link
              to="/our-homes"
              className="px-4 py-2 rounded-full hover:bg-white/20 backdrop-blur-sm transition-all font-medium hover:scale-105 text-white visited:text-white active:text-white focus:text-white no-underline"
            >
              Our Homes
            </Link>

            <Link
              to="/activities"
              className="px-4 py-2 rounded-full hover:bg-white/20 backdrop-blur-sm transition-all font-medium hover:scale-105 text-white visited:text-white active:text-white focus:text-white no-underline"
            >
              Activities
            </Link>

            <Link
              to="/apply"
              className="px-4 py-2 rounded-full hover:bg-white/20 backdrop-blur-sm transition-all font-medium hover:scale-105 text-white visited:text-white active:text-white focus:text-white no-underline"
            >
              Apply
            </Link>

            <Link
              to="/contact"
              className="px-4 py-2 rounded-full hover:bg-white/20 backdrop-blur-sm transition-all font-medium hover:scale-105 text-white visited:text-white active:text-white focus:text-white no-underline"
            >
              Contact
            </Link>

            <Link
              to="/careers"
              className="px-4 py-2 rounded-full hover:bg-white/20 backdrop-blur-sm transition-all font-medium hover:scale-105 text-white visited:text-white active:text-white focus:text-white no-underline"
            >
              Careers
            </Link>

            {isLoggedIn && (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-full hover:bg-white/20 backdrop-blur-sm transition-all font-medium hover:scale-105 text-white visited:text-white active:text-white focus:text-white no-underline"
              >
                Dashboard
              </Link>
            )}

            {isAdmin && (
              <>
                <Link
                  to="/admin/applications"
                  className="px-4 py-2 rounded-full hover:bg-white/20 backdrop-blur-sm transition-all font-medium hover:scale-105 text-white visited:text-white active:text-white focus:text-white no-underline"
                >
                  Resident Apps
                </Link>
                <Link
                  to="/admin/opportunity-applications"
                  className="px-4 py-2 rounded-full hover:bg-white/20 backdrop-blur-sm transition-all font-medium hover:scale-105 text-white visited:text-white active:text-white focus:text-white no-underline"
                >
                  Opportunity Apps
                </Link>
                <Link
                  to="/admin/leads"
                  className="px-4 py-2 rounded-full hover:bg-white/20 backdrop-blur-sm transition-all font-medium hover:scale-105 text-white visited:text-white active:text-white focus:text-white no-underline"
                >
                  Leads
                </Link>
                <Link
                  to="/admin/users"
                  className="px-4 py-2 rounded-full hover:bg-white/20 backdrop-blur-sm transition-all font-medium hover:scale-105 text-white visited:text-white active:text-white focus:text-white no-underline"
                >
                  Users
                </Link>
                <Link
                  to="/admin/job-postings"
                  className="px-4 py-2 rounded-full hover:bg-white/20 backdrop-blur-sm transition-all font-medium hover:scale-105 text-white visited:text-white active:text-white focus:text-white no-underline"
                >
                  Job Postings
                </Link>
                <Link
                  to="/admin/job-applications"
                  className="px-4 py-2 rounded-full hover:bg-white/20 backdrop-blur-sm transition-all font-medium hover:scale-105 text-white visited:text-white active:text-white focus:text-white no-underline"
                >
                  Job Apps
                </Link>
              </>
            )}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="ml-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-5 py-2 rounded-full transition-all font-medium border-2 border-white/30 hover:scale-105 text-white visited:text-white active:text-white focus:text-white no-underline"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="ml-2 px-5 py-2 rounded-full hover:bg-white/20 backdrop-blur-sm transition-all font-medium hover:scale-105 text-white visited:text-white active:text-white focus:text-white no-underline"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-[#4A6741] hover:bg-[#F5F1E8] px-6 py-2 rounded-full transition-all font-bold shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Contact Us button - positioned center-right */}
          <Link
            to="/contact"
            className="md:hidden absolute left-[60%] transform -translate-x-1/2 text-white px-6 py-2 rounded-full hover:bg-white/20 backdrop-blur-sm transition-all font-bold hover:scale-105 text-center text-sm"
          >
            CONTACT US
          </Link>

          {/* Mobile layout - navigation buttons */}
          <div className="md:hidden ml-auto">
            {/* Stacked buttons */}
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="bg-white text-[#4A6741] px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all font-bold hover:scale-105 text-center text-sm whitespace-nowrap"
              >
                HOME
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="bg-white text-[#4A6741] px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all font-bold hover:scale-105 text-center text-sm whitespace-nowrap"
              >
                {mobileMenuOpen ? '✕' : 'MENU'}
              </button>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-white text-[#4A6741] px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all font-bold hover:scale-105 text-center text-sm whitespace-nowrap"
                >
                  LOGOUT
                </button>
              ) : (
                <Link
                  to="/login"
                  className="bg-white text-[#4A6741] px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all font-bold hover:scale-105 text-center text-sm whitespace-nowrap"
                >
                  LOGIN
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu - slide from left */}
      <>
        {/* Backdrop overlay */}
        <div
          className={`fixed inset-0 bg-black z-40 md:hidden transition-opacity duration-300 ease-in-out ${
            mobileMenuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
          }`}
          onClick={closeMobileMenu}
        ></div>

        {/* Slide-out menu with close button */}
        <div className="relative">
          <div className={`fixed top-0 left-0 h-auto max-h-screen w-64 bg-gradient-to-b from-[#5A7A5F] to-[#4A6741] backdrop-blur-lg z-50 md:hidden transform transition-transform duration-500 ease-in-out overflow-hidden rounded-r-[32px] border-r-4 border-t-4 border-b-4 border-white/30 pt-4 pl-4 pr-8 pb-8 ${
            mobileMenuOpen ? 'translate-x-0 shadow-[6px_0_16px_rgba(0,0,0,0.25)]' : '-translate-x-full'
          }`}>
            <div className="space-y-2">
            <Link
              to="/our-homes"
              onClick={closeMobileMenu}
              className="block px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-semibold backdrop-blur-sm text-white visited:text-white active:text-white focus:text-white no-underline"
            >
              Our Homes
            </Link>

            <Link
              to="/activities"
              onClick={closeMobileMenu}
              className="block px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-semibold backdrop-blur-sm text-white visited:text-white active:text-white focus:text-white no-underline"
            >
              Activities
            </Link>

            <Link
              to="/apply"
              onClick={closeMobileMenu}
              className="block px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-semibold backdrop-blur-sm text-white visited:text-white active:text-white focus:text-white no-underline"
            >
              Apply for Residency
            </Link>

            <Link
              to="/careers"
              onClick={closeMobileMenu}
              className="block px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-semibold backdrop-blur-sm text-white visited:text-white active:text-white focus:text-white no-underline"
            >
              Careers
            </Link>

            {isLoggedIn && (
              <Link
                to="/dashboard"
                onClick={closeMobileMenu}
                className="block px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-semibold backdrop-blur-sm text-white visited:text-white active:text-white focus:text-white no-underline"
              >
                Dashboard
              </Link>
            )}

            {isAdmin && (
              <>
                <Link
                  to="/admin/applications"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-semibold backdrop-blur-sm text-white visited:text-white active:text-white focus:text-white no-underline"
                >
                  Resident Apps
                </Link>
                <Link
                  to="/admin/opportunity-applications"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-semibold backdrop-blur-sm text-white visited:text-white active:text-white focus:text-white no-underline"
                >
                  Opportunity Apps
                </Link>
                <Link
                  to="/admin/leads"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-semibold backdrop-blur-sm text-white visited:text-white active:text-white focus:text-white no-underline"
                >
                  Leads
                </Link>
                <Link
                  to="/admin/users"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-semibold backdrop-blur-sm text-white visited:text-white active:text-white focus:text-white no-underline"
                >
                  Users
                </Link>
                <Link
                  to="/admin/job-postings"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-semibold backdrop-blur-sm text-white visited:text-white active:text-white focus:text-white no-underline"
                >
                  Job Postings
                </Link>
                <Link
                  to="/admin/job-applications"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-semibold backdrop-blur-sm text-white visited:text-white active:text-white focus:text-white no-underline"
                >
                  Job Applications
                </Link>
              </>
            )}

            {!isLoggedIn && (
              <>
                <div className="border-t border-white/30 my-3"></div>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-xl bg-white text-[#4A6741] hover:bg-[#F5F1E8] transition-all font-bold shadow-lg text-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
          </div>

          {/* Close button next to menu */}
          <button
            onClick={closeMobileMenu}
            className={`fixed top-4 left-[248px] z-50 md:hidden bg-white text-[#4A6741] rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out font-bold text-xl ${
              mobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            }`}
          >
            ✕
          </button>
        </div>
      </>
    </nav>
  );
};

export default Navbar;
