import React from 'react';
import { motion } from 'framer-motion';

export function AnalysisCalendar() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-xl overflow-hidden shadow-sm">
            <iframe 
              src="https://calendar.google.com/calendar/embed?src=AcZssZ38y4xKwEytQ9iCvWSFdjDD-xEjrzOphtiYVhJQdYiMI83re9SFeVEpQrUFGSngp1BXoTF6PEBj&mode=AGENDA" 
              style={{ border: 0 }} 
              width="100%" 
              height="650" 
              frameBorder="0"
              title="Schedule Appointment"
              allowFullScreen
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}