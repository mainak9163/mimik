"use client";
import { FC, useState, useEffect } from "react";

interface CarouselProps {
  images: string[];
  autoPlayInterval?: number;
}

const CustomCarousel: FC<CarouselProps> = ({
  images,
  autoPlayInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, images.length, autoPlayInterval]);

  const goToPrevious = () => {
    if (isAnimating) return;
    setDirection("prev");
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToNext = () => {
    if (isAnimating) return;
    setDirection("next");
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating) return;
    setDirection(index > currentIndex ? "next" : "prev");
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="w-full  rounded-3xl relative">
      {/* Main image container with animation classes */}
      <div className="w-full relative overflow-hidden">
        <div
          className={`transform transition-all duration-500 ease-in-out ${
            isAnimating
              ? direction === "next"
                ? "scale-95 opacity-90"
                : "scale-105 opacity-90"
              : "scale-100 opacity-100"
          }`}
        >
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full max-w-2xl mx-auto h-auto object-cover rounded-3xl"
          />
        </div>

        {/* Navigation arrows with hover effects */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-1/2 h-full bg-transparent text-white  p-2 focus:outline-none transition-all duration-200 hover:scale-110"
              aria-label="Previous slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-1/2 h-full bg-transparent text-white p-2 focus:outline-none transition-all duration-200 hover:scale-110 flex justify-end items-center"
              aria-label="Next slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>
      {/* Animated indicators */}
      {images.length > 1 && (
        <div className="absolute -bottom-5 left-0 right-0 z-20 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 shadow-2xl ${
                index === currentIndex
                  ? "bg-black/60 w-6 transform scale-110"
                  : "bg-black/20 hover:bg-gray-200 w-2 hover:scale-110"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomCarousel;
