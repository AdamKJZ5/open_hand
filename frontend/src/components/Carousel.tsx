import { useState, useEffect, useRef } from 'react';

interface CarouselProps {
  slides: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const Carousel = ({ slides, autoPlay = true, autoPlayInterval = 5000 }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50; // Minimum distance for a swipe

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0); // Reset touch end
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }

    // Reset
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    setDragOffset(0);
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const currentPosition = e.clientX;
    const offset = currentPosition - dragStart;
    setDragOffset(offset);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const distance = -dragOffset;
    const isLeftDrag = distance > minSwipeDistance;
    const isRightDrag = distance < -minSwipeDistance;

    if (isLeftDrag) {
      goToNext();
    } else if (isRightDrag) {
      goToPrevious();
    }

    // Reset
    setIsDragging(false);
    setDragStart(0);
    setDragOffset(0);
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, autoPlay, autoPlayInterval]);

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full select-none">
      {/* Slides Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-3xl cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`flex ${isDragging ? 'transition-none' : 'transition-transform duration-700 ease-out'}`}
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${isDragging ? dragOffset : 0}px))`
          }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="min-w-full pointer-events-none">
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#F5F1E8]/90 hover:bg-[#F5F1E8] text-gray-800 p-3 md:p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 z-10"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#F5F1E8]/90 hover:bg-[#F5F1E8] text-gray-800 p-3 md:p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 z-10"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 md:gap-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'bg-[#F5F1E8] w-8 md:w-12 h-3 md:h-4 shadow-lg'
                  : 'bg-[#F5F1E8]/60 w-3 md:w-4 h-3 md:h-4 hover:bg-[#F5F1E8]/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
