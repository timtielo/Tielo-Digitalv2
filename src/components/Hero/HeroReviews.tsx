import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
  {
    name: 'Jack van Eijk',
    role: 'Allround Klusbedrijf Specht',
    quote: 'Alles werd duidelijk afgesproken, zonder gedoe.',
    rating: 5
  },
  {
    name: 'Youssef Fazazi',
    role: 'Mr. Clogged 24/7',
    quote: 'Ik twijfelde of ik een eigen website nodig had, maar door de hoge kosten en het gebrek aan direct klantcontact via Werkspot besloot ik de stap te zetten. Tim regelde alles snel en professioneel, nu bellen klanten me direct en ben ik minder afhankelijk.',
    rating: 5
  },
  {
    name: 'Lars van der Meer',
    role: 'Meer Impact Marketing',
    quote: 'Professioneel, supersnel en helemaal naar wens. Binnen een paar dagen was alles geregeld, van ons eerste contact tot het online-gaan van de site.',
    rating: 5
  },
  {
    name: "Job 't Gilde",
    role: "'t Gilde Gevelwerken",
    quote: 'Tim heeft in enkele dagen een mooie website voor mij gebouwd. De communicatie was helder en aanpassingen waren snel gedaan.',
    rating: 5
  },
  {
    name: 'Iris Achtereekte',
    role: 'Her Horizon',
    quote: 'Binnen een week stond mijn hele website live. Tim dacht mee over de vormgeving en hielp ook bij het uitwerken van mijn businessidee.',
    rating: 5
  },
  {
    name: 'Bart Vermeulen',
    role: 'i-Lizard',
    quote: 'Erg tevreden met Tim\'s persoonlijke benadering, zijn betrokkenheid, de kwaliteit en relevantie van het eindproduct, en de schappelijke ontwikkelings- en beheer-kosten.',
    rating: 5
  }
];

export function HeroReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedReviews, setDisplayedReviews] = useState([
    { reviewIndex: 0, id: 0 },
    { reviewIndex: 1, id: 1 },
    { reviewIndex: 2, id: 2 }
  ]);
  const [nextId, setNextId] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const nextReviewIndex = (currentIndex + 3) % reviews.length;
    setDisplayedReviews(prev => [
      { reviewIndex: nextReviewIndex, id: nextId },
      ...prev.slice(0, 2)
    ]);
    setNextId(prev => prev + 1);
  }, [currentIndex]);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <>
      <div className="relative md:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="td-card p-5 shadow-sharp"
          >
            <div className="flex items-center gap-1 mb-3">
              {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-tielo-orange text-tielo-orange" />
              ))}
            </div>
            <p className="text-tielo-navy/70 mb-4 text-sm italic leading-relaxed">
              "{reviews[currentIndex].quote}"
            </p>
            <div>
              <p className="font-semibold text-sm text-tielo-navy">{reviews[currentIndex].name}</p>
              <p className="text-xs text-gray-400">{reviews[currentIndex].role}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={prevReview}
            className="p-2 rounded-td bg-white border border-gray-200 shadow-sharp hover:shadow-sharp-hover transition-all active:scale-95 min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-5 h-5 text-tielo-navy" />
          </button>

          <div className="flex gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-tielo-orange w-6' : 'bg-gray-300 w-2'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextReview}
            className="p-2 rounded-td bg-white border border-gray-200 shadow-sharp hover:shadow-sharp-hover transition-all active:scale-95 min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Next review"
          >
            <ChevronRight className="w-5 h-5 text-tielo-navy" />
          </button>
        </div>
      </div>

      <div className="hidden md:block relative overflow-hidden" style={{ height: '420px' }}>
        <AnimatePresence initial={false}>
          {displayedReviews.map((item, position) => {
            const review = reviews[item.reviewIndex];
            const offsets = [0, 155, 290];
            return (
              <motion.div
                key={item.id}
                initial={{
                  opacity: 0,
                  y: -80,
                  scale: 0.97
                }}
                animate={{
                  opacity: position === 2 ? 0.35 : position === 1 ? 0.85 : 1,
                  y: offsets[position],
                  scale: 1 - position * 0.02
                }}
                exit={{
                  opacity: 0,
                  y: 420,
                  scale: 0.95
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="absolute left-0 right-0 td-card td-tech-corner p-5 shadow-sharp overflow-hidden"
                style={{ zIndex: 3 - position }}
              >
                <div className="absolute inset-0 td-micro-grid opacity-20 pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-tielo-orange text-tielo-orange" />
                    ))}
                  </div>
                  <p className="text-tielo-navy/70 mb-3 text-sm italic leading-relaxed line-clamp-3">
                    "{review.quote}"
                  </p>
                  <div>
                    <p className="font-semibold text-sm text-tielo-navy">{review.name}</p>
                    <p className="text-xs text-gray-400">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
}
