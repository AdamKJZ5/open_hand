import { useState } from 'react';
import { Link } from 'react-router-dom';

const OurHomes = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'virtual-tour' | 'amenities'>('overview');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Sample images - replace with actual image URLs
  const galleryImages = [
    { id: 1, url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', title: 'Spacious Living Room', category: 'common' },
    { id: 2, url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800', title: 'Private Bedroom', category: 'rooms' },
    { id: 3, url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800', title: 'Dining Area', category: 'common' },
    { id: 4, url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800', title: 'Garden View', category: 'outdoor' },
    { id: 5, url: 'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800', title: 'Activity Room', category: 'common' },
    { id: 6, url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800', title: 'Bathroom', category: 'rooms' },
    { id: 7, url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', title: 'Exterior View', category: 'outdoor' },
    { id: 8, url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', title: 'Kitchen', category: 'common' },
  ];

  const amenities = [
    { icon: '🛏️', title: 'Private & Shared Rooms', description: 'Comfortable, fully-furnished accommodations' },
    { icon: '🍽️', title: 'Chef-Prepared Meals', description: 'Three nutritious meals daily' },
    { icon: '🏥', title: 'Medical Support', description: '24/7 healthcare monitoring' },
    { icon: '🎨', title: 'Activity Center', description: 'Arts, crafts, and recreation' },
    { icon: '📚', title: 'Library & Lounge', description: 'Quiet spaces for reading and relaxation' },
    { icon: '🌳', title: 'Garden Spaces', description: 'Beautiful outdoor areas' },
    { icon: '🚿', title: 'Modern Bathrooms', description: 'Safety-equipped with accessibility features' },
    { icon: '📺', title: 'Entertainment Areas', description: 'TV rooms and game spaces' },
    { icon: '💪', title: 'Fitness Room', description: 'Light exercise equipment' },
    { icon: '👥', title: 'Visiting Areas', description: 'Comfortable spaces for family visits' },
    { icon: '🔒', title: 'Security System', description: '24/7 monitoring and emergency response' },
    { icon: '♿', title: 'ADA Accessible', description: 'Wheelchair-friendly throughout' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#4A6741] via-[#5A7A5F] to-[#7C9A7F] text-white py-20 md:py-28 overflow-hidden -mt-1">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        {/* Animated background shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#8B6F47]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#7C9A7F]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Welcome to Our Homes
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 font-medium">
              Explore our beautiful, comfortable facilities designed with care, safety, and dignity in mind.
            </p>
            <Link
              to="/apply"
              className="inline-block px-8 py-4 bg-[#F5F1E8] text-[#4A6741] rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
            >
              Schedule a Personal Tour
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#F5F1E8] to-transparent"></div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-[#F5F1E8] shadow-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'overview'
                  ? 'text-[#4A6741] border-b-4 border-[#4A6741]'
                  : 'text-gray-600 hover:text-[#4A6741]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-6 py-4 font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'gallery'
                  ? 'text-[#4A6741] border-b-4 border-[#4A6741]'
                  : 'text-gray-600 hover:text-[#4A6741]'
              }`}
            >
              Photo Gallery
            </button>
            <button
              onClick={() => setActiveTab('virtual-tour')}
              className={`px-6 py-4 font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'virtual-tour'
                  ? 'text-[#4A6741] border-b-4 border-[#4A6741]'
                  : 'text-gray-600 hover:text-[#4A6741]'
              }`}
            >
              Virtual Tour
            </button>
            <button
              onClick={() => setActiveTab('amenities')}
              className={`px-6 py-4 font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'amenities'
                  ? 'text-[#4A6741] border-b-4 border-[#4A6741]'
                  : 'text-gray-600 hover:text-[#4A6741]'
              }`}
            >
              Amenities
            </button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-12 animate-fadeIn">
            <div className="bg-[#F5F1E8] rounded-xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    A Place to Call Home
                  </h2>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    At OpenHand Care, we've created warm, inviting spaces that feel like home. Our facilities are thoughtfully designed to balance independence with necessary support, ensuring residents feel comfortable, safe, and valued.
                  </p>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    Each residence features spacious common areas for socializing, private spaces for relaxation, and beautiful outdoor gardens where residents can enjoy nature and fresh air.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-[#4A6741] rounded-full flex items-center justify-center text-white text-sm mr-3 mt-1">✓</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Modern Facilities</h4>
                        <p className="text-gray-600">Updated in 2023 with the latest safety and comfort features</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-[#4A6741] rounded-full flex items-center justify-center text-white text-sm mr-3 mt-1">✓</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Accessible Design</h4>
                        <p className="text-gray-600">Wheelchair-friendly with wide hallways and accessible bathrooms</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-[#4A6741] rounded-full flex items-center justify-center text-white text-sm mr-3 mt-1">✓</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Home-Like Atmosphere</h4>
                        <p className="text-gray-600">Cozy furnishings and décor that feels warm and welcoming</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-96 lg:h-auto">
                  <img
                    src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200"
                    alt="Living room"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Video Section */}
            <div className="bg-[#F5F1E8] rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Experience Our Community
              </h2>
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Virtual tour video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-center text-gray-600">
                Take a video tour of our facilities and see what makes OpenHand Care special.
              </p>
            </div>

            {/* Room Types */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Room Options
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#F5F1E8] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <img
                    src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800"
                    alt="Private room"
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Private Rooms</h3>
                    <p className="text-gray-600 mb-4">
                      Spacious private accommodations with en-suite bathroom, large windows, and personalized décor options. Perfect for residents who value privacy and independence.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Private bathroom</li>
                      <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Personal temperature control</li>
                      <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Cable TV and Wi-Fi</li>
                      <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Emergency call system</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-[#F5F1E8] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <img
                    src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800"
                    alt="Shared room"
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Shared Rooms</h3>
                    <p className="text-gray-600 mb-4">
                      Comfortable shared accommodations perfect for residents who enjoy companionship. Each resident has their own personal space with privacy curtains and storage.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Shared bathroom</li>
                      <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Personal storage space</li>
                      <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Cable TV and Wi-Fi</li>
                      <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Emergency call system</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Photo Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all"
                  onClick={() => setSelectedImage(image.url)}
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold">{image.title}</h3>
                      <span className="text-[#7C9A7F] text-sm capitalize">{image.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Virtual Tour Tab */}
        {activeTab === 'virtual-tour' && (
          <div className="animate-fadeIn space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">360° Virtual Tour</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our facilities from the comfort of your home with our interactive virtual tour.
              </p>
            </div>

            {/* Main Virtual Tour Viewer */}
            <div className="bg-[#F5F1E8] rounded-xl shadow-lg overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-[#E8EDE7] to-[#F5F1E8] flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🏠</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Interactive 360° Tour</h3>
                  <p className="text-gray-600 mb-6">
                    Click on the locations below to explore different areas of our facility
                  </p>
                  <button className="px-6 py-3 bg-[#4A6741] text-white rounded-lg font-semibold hover:bg-[#3A5531] transition-colors">
                    Start Virtual Tour
                  </button>
                </div>
              </div>
            </div>

            {/* Tour Locations */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Main Entrance', icon: '🚪' },
                { name: 'Living Room', icon: '🛋️' },
                { name: 'Dining Area', icon: '🍽️' },
                { name: 'Private Room', icon: '🛏️' },
                { name: 'Garden', icon: '🌳' },
                { name: 'Activity Room', icon: '🎨' },
                { name: 'Kitchen', icon: '👨‍🍳' },
                { name: 'Library', icon: '📚' },
              ].map((location, index) => (
                <button
                  key={index}
                  className="bg-[#F5F1E8] p-4 rounded-lg shadow hover:shadow-lg transition-all transform hover:scale-105 text-center"
                >
                  <div className="text-4xl mb-2">{location.icon}</div>
                  <div className="font-semibold text-gray-900">{location.name}</div>
                </button>
              ))}
            </div>

            {/* Additional Tour Videos */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Video Walkthroughs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#F5F1E8] rounded-lg shadow-lg overflow-hidden">
                  <div className="aspect-video bg-gray-900">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                      title="Room tour"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900">Private Room Tour</h4>
                    <p className="text-sm text-gray-600">See what our private accommodations look like</p>
                  </div>
                </div>

                <div className="bg-[#F5F1E8] rounded-lg shadow-lg overflow-hidden">
                  <div className="aspect-video bg-gray-900">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                      title="Common areas tour"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900">Common Areas Tour</h4>
                    <p className="text-sm text-gray-600">Explore our shared living spaces</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Amenities Tab */}
        {activeTab === 'amenities' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Amenities</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need for comfortable, enriching living.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="bg-[#F5F1E8] rounded-xl shadow-md p-6 hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <div className="text-5xl mb-3">{amenity.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{amenity.title}</h3>
                  <p className="text-gray-600 text-sm">{amenity.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] rounded-xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Want to See More?</h3>
              <p className="text-[#E8EDE7] mb-6">Schedule an in-person tour to experience our facilities firsthand.</p>
              <Link
                to="/apply"
                className="inline-block px-8 py-3 bg-[#F5F1E8] text-[#3A5531] rounded-lg font-semibold hover:bg-[#E8EDE7] transition-all transform hover:scale-105"
              >
                Schedule a Tour
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default OurHomes;
