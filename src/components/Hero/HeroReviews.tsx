import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
  {
    name: 'Iris Achtereekte',
    role: 'Her Horizon',
    quote: 'Binnen een week stond mijn hele website live. Tim dacht mee over de vormgeving en hielp ook bij het uitwerken van mijn businessidee.',
    rating: 5
  },
  {
    name: "Job 't Gilde",
    role: "'t Gilde Gevelwerken",
    quote: 'Tim heeft in enkele dagen een mooie website voor mij gebouwd. De communicatie was helder en aanpassingen waren snel gedaan.',
    rating: 5
  },
  {
    name: 'Lars van der Meer',
    role: 'Meer Impact Marketing',
    quote: 'Professioneel, supersnel en helemaal naar wens. Binnen een paar dagen was alles geregeld, van ons eerste contact tot het online-gaan van de site.',
    rating: 5
  },
  {
    name: 'Youssef Fazazi',
    role: 'Mr. Clogged 24/7',
    quote: 'Ik twijfelde of ik een eigen website nodig had, maar door de hoge kosten en het gebrek aan direct klantcontact via Werkspot besloot ik de stap te zetten. Tim regelde alles snel en professioneel, nu bellen klanten me direct en ben ik minder afhankelijk.',
    rating: 5
  }
];

export function HeroReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleReviews, setVisibleReviews] = useState([0, 1, 2]);

  useEffect(() => {
    // Auto-rotate reviews every 5 seconds
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Update visible reviews for desktop view
    const newVisible = [
      currentIndex,
      (currentIndex + 1) % reviews.length,
      (currentIndex + 2) % reviews.length
    ];
    setVisibleReviews(newVisible);
  }, [currentIndex]);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <>
      {/* Mobile Carousel View */}
      <div className="relative md:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <div className="flex items-center gap-1 mb-2">
              {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-700 mb-3 text-sm italic leading-relaxed">
              "{reviews[currentIndex].quote}"
            </p>
            <div>
              <p className="font-semibold text-sm text-gray-900">{reviews[currentIndex].name}</p>
              <p className="text-xs text-gray-500">{reviews[currentIndex].role}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={prevReview}
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all active:scale-95 min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <div className="flex gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-blue-600 w-6' : 'bg-gray-300 w-2'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextReview}
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all active:scale-95 min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Next review"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Desktop Animated Vertical Carousel */}
      <div className="hidden md:block relative overflow-hidden" style={{ height: '340px' }}>
        <AnimatePresence initial={false}>
          {visibleReviews.map((reviewIndex, position) => (
            <motion.div
              key={`${reviewIndex}-${currentIndex}`}
              initial={{
                opacity: 0,
                y: -100,
                scale: 0.95
              }}
              animate={{
                opacity: position === 2 ? 0 : 1,
                y: position * 160,
                scale: 1
              }}
              exit={{
                opacity: 0,
                y: 340,
                scale: 0.95
              }}
              transition={{
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="absolute w-full bg-white rounded-xl p-6 shadow-md"
              style={{ zIndex: 3 - position }}
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(reviews[reviewIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 text-base italic leading-relaxed">
                "{reviews[reviewIndex].quote}"
              </p>
              <div>
                <p className="font-semibold text-base text-gray-900">{reviews[reviewIndex].name}</p>
                <p className="text-sm text-gray-500">{reviews[reviewIndex].role}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
