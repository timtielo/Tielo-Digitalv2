import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

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
  }
];

export function HeroReviews() {
  return (
    <div className="space-y-4">
      {reviews.map((review, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.2 }}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex items-center gap-1 mb-3">
            {[...Array(review.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
            ))}
          </div>
          <p className="text-gray-600 mb-4 text-sm italic">"{review.quote}"</p>
          <div>
            <p className="font-semibold text-sm">{review.name}</p>
            <p className="text-xs text-gray-500">{review.role}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
