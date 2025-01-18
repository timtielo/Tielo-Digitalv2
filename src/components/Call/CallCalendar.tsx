import React from 'react';
import { motion } from 'framer-motion';

export function CallCalendar() {
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
              src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ38y4xKwEytQ9iCvWSFdjDD-xEjrzOphtiYVhJQdYiMI83re9SFeVEpQrUFGSngp1BXoTF6PEBj?gv=true" 
              style={{ border: 0, width: '100%', minHeight: '650px' }} 
              frameBorder="0"
              title="Schedule Appointment"
              allow="camera *; microphone *"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}