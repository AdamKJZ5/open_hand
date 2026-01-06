import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';

const Home = () => {
  // Services Slides - Image placeholder with title on top
  const servicesSlides = [
    <div className="bg-white min-h-[500px] md:min-h-[600px] flex flex-col">
      <div className="px-8 py-8 text-center">
        <h3 className="text-2xl md:text-3xl font-black text-[#4A6741] mb-3">24/7 Professional Care</h3>
        <p className="text-base md:text-lg text-[#736B5E] max-w-3xl mx-auto">
          Our dedicated team of experienced caregivers is available around the clock to ensure safety, comfort, and personalized attention for every resident.
        </p>
      </div>
      {/* Large space for image */}
      <div className="flex-1 bg-[#F5F1E8] flex items-center justify-center">
        <div className="text-8xl opacity-20">❤️</div>
      </div>
    </div>,

    <div className="bg-white min-h-[500px] md:min-h-[600px] flex flex-col">
      <div className="px-8 py-8 text-center">
        <h3 className="text-2xl md:text-3xl font-black text-[#4A6741] mb-3">Memory Care Services</h3>
        <p className="text-base md:text-lg text-[#736B5E] max-w-3xl mx-auto">
          Specialized care for residents with Alzheimer's and dementia, featuring secure environments and cognitive stimulation programs designed by experts.
        </p>
      </div>
      <div className="flex-1 bg-[#F5F1E8] flex items-center justify-center">
        <div className="text-8xl opacity-20">⚕️</div>
      </div>
    </div>,

    <div className="bg-white min-h-[500px] md:min-h-[600px] flex flex-col">
      <div className="px-8 py-8 text-center">
        <h3 className="text-2xl md:text-3xl font-black text-[#4A6741] mb-3">Assisted Living</h3>
        <p className="text-base md:text-lg text-[#736B5E] max-w-3xl mx-auto">
          Independence with support - assistance with daily activities while maintaining dignity and freedom in a safe, supportive community.
        </p>
      </div>
      <div className="flex-1 bg-[#F5F1E8] flex items-center justify-center">
        <div className="text-8xl opacity-20">🏥</div>
      </div>
    </div>,

    <div className="bg-white min-h-[500px] md:min-h-[600px] flex flex-col">
      <div className="px-8 py-8 text-center">
        <h3 className="text-2xl md:text-3xl font-black text-[#4A6741] mb-3">Medication Management</h3>
        <p className="text-base md:text-lg text-[#736B5E] max-w-3xl mx-auto">
          Professional medication administration and monitoring, ensuring proper dosages and timing for optimal health and peace of mind.
        </p>
      </div>
      <div className="flex-1 bg-[#F5F1E8] flex items-center justify-center">
        <div className="text-8xl opacity-20">💊</div>
      </div>
    </div>,

    <div className="bg-white min-h-[500px] md:min-h-[600px] flex flex-col">
      <div className="px-8 py-8 text-center">
        <h3 className="text-2xl md:text-3xl font-black text-[#4A6741] mb-3">Respite Care</h3>
        <p className="text-base md:text-lg text-[#736B5E] max-w-3xl mx-auto">
          Short-term care services giving family caregivers a well-deserved break while ensuring their loved ones receive excellent care.
        </p>
      </div>
      <div className="flex-1 bg-[#F5F1E8] flex items-center justify-center">
        <div className="text-8xl opacity-20">🚑</div>
      </div>
    </div>
  ];

  // Amenities Slides - Image placeholder with title on top
  const amenitiesSlides = [
    <div className="bg-white min-h-[500px] md:min-h-[600px] flex flex-col">
      <div className="px-8 py-8 text-center">
        <h3 className="text-2xl md:text-3xl font-black text-[#4A6741] mb-3">Gourmet Dining</h3>
        <p className="text-base md:text-lg text-[#736B5E] max-w-3xl mx-auto">
          Chef-prepared nutritious meals daily, accommodating dietary restrictions and preferences with restaurant-style dining experiences.
        </p>
      </div>
      <div className="flex-1 bg-[#F5F1E8] flex items-center justify-center">
        <div className="text-8xl opacity-20">🍽️</div>
      </div>
    </div>,

    <div className="bg-white min-h-[500px] md:min-h-[600px] flex flex-col">
      <div className="px-8 py-8 text-center">
        <h3 className="text-2xl md:text-3xl font-black text-[#4A6741] mb-3">Fitness & Wellness</h3>
        <p className="text-base md:text-lg text-[#736B5E] max-w-3xl mx-auto">
          State-of-the-art fitness center, pool, yoga classes, and personalized wellness programs to maintain physical and mental health.
        </p>
      </div>
      <div className="flex-1 bg-[#F5F1E8] flex items-center justify-center">
        <div className="text-8xl opacity-20">🏊</div>
      </div>
    </div>,

    <div className="bg-white min-h-[500px] md:min-h-[600px] flex flex-col">
      <div className="px-8 py-8 text-center">
        <h3 className="text-2xl md:text-3xl font-black text-[#4A6741] mb-3">Entertainment & Events</h3>
        <p className="text-base md:text-lg text-[#736B5E] max-w-3xl mx-auto">
          Live music, movie nights, game tournaments, cultural celebrations, and guest speakers for endless entertainment and social connection.
        </p>
      </div>
      <div className="flex-1 bg-[#F5F1E8] flex items-center justify-center">
        <div className="text-8xl opacity-20">🎭</div>
      </div>
    </div>,

    <div className="bg-white min-h-[500px] md:min-h-[600px] flex flex-col">
      <div className="px-8 py-8 text-center">
        <h3 className="text-2xl md:text-3xl font-black text-[#4A6741] mb-3">Library & Learning</h3>
        <p className="text-base md:text-lg text-[#736B5E] max-w-3xl mx-auto">
          Extensive library, computer room with internet access, educational classes, and lifelong learning opportunities to keep minds sharp.
        </p>
      </div>
      <div className="flex-1 bg-[#F5F1E8] flex items-center justify-center">
        <div className="text-8xl opacity-20">📚</div>
      </div>
    </div>,

    <div className="bg-white min-h-[500px] md:min-h-[600px] flex flex-col">
      <div className="px-8 py-8 text-center">
        <h3 className="text-2xl md:text-3xl font-black text-[#4A6741] mb-3">Transportation Services</h3>
        <p className="text-base md:text-lg text-[#736B5E] max-w-3xl mx-auto">
          Scheduled outings, medical appointments, shopping trips, and group excursions with our safe, comfortable shuttle service.
        </p>
      </div>
      <div className="flex-1 bg-[#F5F1E8] flex items-center justify-center">
        <div className="text-8xl opacity-20">🚐</div>
      </div>
    </div>,

    <div className="bg-white min-h-[500px] md:min-h-[600px] flex flex-col">
      <div className="px-8 py-8 text-center">
        <h3 className="text-2xl md:text-3xl font-black text-[#4A6741] mb-3">Spa & Beauty Salon</h3>
        <p className="text-base md:text-lg text-[#736B5E] max-w-3xl mx-auto">
          On-site salon and spa services including haircuts, manicures, pedicures, and massage therapy for ultimate pampering and self-care.
        </p>
      </div>
      <div className="flex-1 bg-[#F5F1E8] flex items-center justify-center">
        <div className="text-8xl opacity-20">💆</div>
      </div>
    </div>
  ];

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* Hero Section - Blends with navbar */}
      <section className="relative bg-gradient-to-br from-[#4A6741] via-[#5A7A5F] to-[#7C9A7F] text-white overflow-hidden -mt-1">
        <div className="absolute inset-0 bg-black opacity-5"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[50px] flex items-center justify-center min-h-[250px]">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-0 leading-tight">
              Compassionate Care,<br />
              Comfort & Community
            </h1>
            <div className="flex flex-col gap-[5px] sm:flex-row sm:gap-[50px] justify-center items-center mt-8 mb-0">
              <Link
                to="/apply"
                className="px-8 py-3 bg-white text-[#1f2937] rounded-lg font-semibold text-base hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
              >
                Apply for Residency
              </Link>
              <Link
                to="/our-homes"
                className="px-8 py-3 bg-white text-[#1f2937] rounded-lg font-semibold text-base hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
              >
                Tour Our Homes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Slideshow */}
      <section className="py-24 md:py-32 lg:py-40 bg-[#F5F1E8]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[#4A6741] mb-6">
              Our Amenities
            </h2>
            <p className="text-lg md:text-xl text-[#736B5E] max-w-3xl mx-auto">
              Experience exceptional adult care in a warm, family-like environment where dignity, independence, and quality of life come first.
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <Carousel slides={amenitiesSlides} autoPlayInterval={6000} />
          </div>
        </div>
      </section>

      {/* Services Slideshow */}
      <section className="py-24 md:py-32 lg:py-40 bg-white">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[#4A6741] mb-6">
              Our Services
            </h2>
            <p className="text-lg md:text-xl text-[#736B5E] max-w-3xl mx-auto">
              Comprehensive care tailored to meet unique needs
            </p>
          </div>
          <div className="bg-[#F5F1E8] rounded-3xl shadow-2xl overflow-hidden">
            <Carousel slides={servicesSlides} autoPlayInterval={6000} />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative bg-gradient-to-br from-[#7C9A7F] to-[#4A6741] text-white py-28 md:py-36 lg:py-44 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-5"></div>

        <div className="relative max-w-5xl mx-auto text-center px-6 sm:px-8 lg:px-12">
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
            Ready to Join Our Family?
          </h2>
          <p className="text-xl md:text-2xl mb-16 text-white/95 max-w-3xl mx-auto">
            Schedule a tour, meet our staff, and discover why families trust OpenHand Care for their loved ones.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/contact"
              className="px-8 py-3 bg-white text-[#1f2937] rounded-lg font-semibold text-base hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
            >
              Contact Us Today
            </Link>
            <Link
              to="/apply"
              className="px-8 py-3 bg-white text-[#1f2937] rounded-lg font-semibold text-base hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
            >
              Start Application
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
