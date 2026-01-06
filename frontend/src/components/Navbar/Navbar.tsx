import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [hideNavbar, setHideNavbar] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // Handle scroll to show/hide navbar and floating menu button
  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setHideNavbar(true);
        setShowFloatingMenu(true);
      } else {
        // Scrolling up
        setHideNavbar(false);
        setShowFloatingMenu(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
    <nav className={`bg-gradient-to-br from-[#4A6741] via-[#5A7A5F] to-[#7C9A7F] text-white shadow-xl fixed top-0 w-full z-50 transition-transform duration-500 ease-in-out ${
      hideNavbar ? '-translate-y-full' : 'translate-y-0'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-24 relative">
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2 ml-auto">
            <Link
              to="/"
              className="px-6 py-3 rounded-lg font-semibold text-base transition-all no-underline"
              style={{ color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              Home
            </Link>

            <Link
              to="/our-homes"
              className="px-6 py-3 rounded-lg font-semibold text-base transition-all no-underline"
              style={{ color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              Our Homes
            </Link>

            <Link
              to="/activities"
              className="px-6 py-3 rounded-lg font-semibold text-base transition-all no-underline"
              style={{ color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              Activities
            </Link>

            <Link
              to="/apply"
              className="px-6 py-3 rounded-lg font-semibold text-base transition-all no-underline"
              style={{ color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              Apply
            </Link>

            <Link
              to="/contact"
              className="px-6 py-3 rounded-lg font-semibold text-base transition-all no-underline"
              style={{ color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              Contact
            </Link>

            <Link
              to="/careers"
              className="px-6 py-3 rounded-lg font-semibold text-base transition-all no-underline"
              style={{ color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              Careers
            </Link>

            {isLoggedIn && (
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-lg font-semibold text-base transition-all no-underline"
                style={{ color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                Dashboard
              </Link>
            )}

            {isAdmin && (
              <>
                <Link
                  to="/admin/applications"
                  className="px-6 py-3 rounded-lg font-semibold text-base transition-all no-underline"
                  style={{ color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  Resident Apps
                </Link>
                <Link
                  to="/admin/opportunity-applications"
                  className="px-6 py-3 rounded-lg font-semibold text-base transition-all no-underline"
                  style={{ color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  Opportunity Apps
                </Link>
                <Link
                  to="/admin/leads"
                  className="px-6 py-3 rounded-lg font-semibold text-base transition-all no-underline"
                  style={{ color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  Leads
                </Link>
                <Link
                  to="/admin/users"
                  className="px-6 py-3 rounded-lg font-semibold text-base transition-all no-underline"
                  style={{ color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  Users
                </Link>
                <Link
                  to="/admin/job-postings"
                  className="px-6 py-3 rounded-lg font-semibold text-base transition-all no-underline"
                  style={{ color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  Job Postings
                </Link>
                <Link
                  to="/admin/job-applications"
                  className="px-6 py-3 rounded-lg font-semibold text-base transition-all no-underline"
                  style={{ color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  Job Apps
                </Link>
              </>
            )}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="ml-2 px-6 py-3 rounded-lg font-semibold text-base transition-all no-underline"
                style={{ color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif', background: 'transparent', border: 'none' }}
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="ml-2 px-6 py-3 rounded-lg font-semibold text-base transition-all no-underline"
                  style={{ color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 rounded-lg font-semibold text-base transition-all no-underline"
                  style={{ color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile layout - navigation buttons */}
          <div className="md:hidden grid grid-cols-4 gap-1 w-full">
            <Link
              to="/"
              className="py-2 rounded-full transition-all text-center no-underline"
              style={{ color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif', background: 'transparent', fontSize: '18px' }}
            >
              HOME
            </Link>
            <Link
              to="/contact"
              className="py-2 rounded-full transition-all text-center no-underline"
              style={{ color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif', background: 'transparent', fontSize: '18px' }}
            >
              CONTACT US
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="py-2 rounded-full transition-all text-center border-none"
              style={{ color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif', background: 'transparent', fontSize: '18px' }}
            >
              MENU
            </button>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="py-2 rounded-full transition-all text-center border-none"
                style={{ color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif', background: 'transparent', fontSize: '18px' }}
              >
                LOGOUT
              </button>
            ) : (
              <Link
                to="/login"
                className="py-2 rounded-full transition-all text-center no-underline"
                style={{ color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif', background: 'transparent', fontSize: '18px' }}
              >
                LOGIN
              </Link>
            )}
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

        {/* Slide-out menu */}
        <div className={`fixed left-0 h-auto max-h-screen w-[190px] bg-gradient-to-b from-[#5A7A5F] to-[#4A6741] backdrop-blur-lg z-50 md:hidden transform transition-transform duration-500 ease-in-out overflow-hidden rounded-r-[32px] border-r-4 border-t-4 border-b-4 border-white/30 pt-4 pl-4 pr-8 pb-8 ${
          mobileMenuOpen ? 'translate-x-0 shadow-[6px_0_16px_rgba(0,0,0,0.25)]' : '-translate-x-full'
        }`} style={{ top: '100px' }}>
            <div className="space-y-2">
            <Link
              to="/our-homes"
              onClick={closeMobileMenu}
              className="block px-4 py-3 rounded-xl transition-all no-underline"
              style={{ backgroundColor: '#5A7A5F', color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              Our Homes
            </Link>

            <Link
              to="/apply"
              onClick={closeMobileMenu}
              className="block px-4 py-3 rounded-xl transition-all no-underline"
              style={{ backgroundColor: '#5A7A5F', color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              Apply for Residency
            </Link>

            <Link
              to="/activities"
              onClick={closeMobileMenu}
              className="block px-4 py-3 rounded-xl transition-all no-underline"
              style={{ backgroundColor: '#5A7A5F', color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              Activities
            </Link>

            <Link
              to="/careers"
              onClick={closeMobileMenu}
              className="block px-4 py-3 rounded-xl transition-all no-underline"
              style={{ backgroundColor: '#5A7A5F', color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              Careers
            </Link>

            {isLoggedIn && (
              <Link
                to="/dashboard"
                onClick={closeMobileMenu}
                className="block px-4 py-3 rounded-xl transition-all no-underline"
                style={{ backgroundColor: '#5A7A5F', color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                Dashboard
              </Link>
            )}

            {isAdmin && (
              <>
                <Link
                  to="/admin/applications"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-xl transition-all no-underline"
                  style={{ backgroundColor: '#5A7A5F', color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  Resident Apps
                </Link>
                <Link
                  to="/admin/opportunity-applications"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-xl transition-all no-underline"
                  style={{ backgroundColor: '#5A7A5F', color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  Opportunity Apps
                </Link>
                <Link
                  to="/admin/leads"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-xl transition-all no-underline"
                  style={{ backgroundColor: '#5A7A5F', color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  Leads
                </Link>
                <Link
                  to="/admin/users"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-xl transition-all no-underline"
                  style={{ backgroundColor: '#5A7A5F', color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  Users
                </Link>
                <Link
                  to="/admin/job-postings"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-xl transition-all no-underline"
                  style={{ backgroundColor: '#5A7A5F', color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  Job Postings
                </Link>
                <Link
                  to="/admin/job-applications"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-xl transition-all no-underline"
                  style={{ backgroundColor: '#5A7A5F', color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  Job Applications
                </Link>
              </>
            )}

            <div className="border-t border-white/30 my-3"></div>

            {isLoggedIn ? (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="block w-full px-4 py-3 rounded-xl transition-all text-center border-none"
                style={{ backgroundColor: '#5A7A5F', color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-xl transition-all text-center no-underline mb-2"
                  style={{ backgroundColor: '#5A7A5F', color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-xl transition-all text-center no-underline"
                  style={{ backgroundColor: '#5A7A5F', color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Close button - overlaps menu right edge */}
        <button
          onClick={closeMobileMenu}
          className={`fixed z-[60] md:hidden bg-white text-[#4A6741] rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out font-bold text-xl ${
            mobileMenuOpen ? 'left-[190px] opacity-100' : 'left-[-50px] opacity-0'
          }`}
          style={{ top: '104px' }}
        >
          ✕
        </button>
      </>

      {/* Floating Menu Button - appears on scroll */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className={`fixed z-[60] md:hidden rounded-full w-16 h-16 flex items-center justify-center shadow-2xl transition-all duration-500 ease-in-out ${
          showFloatingMenu ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20 pointer-events-none'
        }`}
        style={{ backgroundColor: '#5A7A5F', top: '60%', left: '16px' }}
      >
        <span style={{ color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
          MENU
        </span>
      </button>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[70] transition-opacity"
            onClick={() => setShowLogoutConfirm(false)}
          ></div>

          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[80] rounded-2xl shadow-2xl p-8 max-w-sm w-[90%]" style={{ backgroundColor: '#5A7A5F' }}>
            <h3 className="text-xl font-bold mb-4 text-center" style={{ color: '#F5F1E8', fontWeight: '600', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Confirm Logout
            </h3>
            <p className="mb-6 text-center" style={{ color: '#F5F1E8', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Are you sure you want to log out?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all"
                style={{ backgroundColor: '#F5F1E8', color: '#4A6741' }}
              >
                No
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all"
                style={{ backgroundColor: '#4A6741', color: '#F5F1E8' }}
              >
                Yes
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
