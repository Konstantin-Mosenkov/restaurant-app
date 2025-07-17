import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useCallback } from "react";

type Slide = {
  id: number;
  image: string;
  alt?: string;
};

type SliderProps = {
  slides: Slide[];
  autoPlay?: boolean;
  interval?: number;
};

export const Slider = ({ slides, autoPlay = false, interval = 3000 }: SliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(0);

  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]); 

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      goToNextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, goToNextSlide]); 

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const diff = startX - endX;
    const swipeThreshold = 50;

    if (diff > swipeThreshold) {
      goToNextSlide();
    } else if (diff < -swipeThreshold) {
      goToPrevSlide();
    }
  };

  return (
    <div className="relative w-full overflow-hidden mt-12 rounded-2xl">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full max-h-[80vh] overflow-hidden flex-shrink-0">
            <img
              src={slide.image}
              alt={slide.alt || `Slide ${slide.id}`}
              className="w-full h-full object-cover"
              draggable="false"
            />
          </div>
        ))}
      </div>
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500 p-2 rounded-full transition"
        aria-label="Previous slide"
      >
        <ChevronLeft size={44}/>
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-500 p-2 rounded-full  transition"
        aria-label="Next slide"
      >
        <ChevronRight size={44}/>
      </button>

      {/* Индикаторы (точки) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition ${
              currentSlide === index ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};