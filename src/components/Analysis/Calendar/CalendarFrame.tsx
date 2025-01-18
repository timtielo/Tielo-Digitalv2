import React from 'react';

export function CalendarFrame() {
  return (
    <div className="rounded-xl overflow-hidden shadow-sm">
      <iframe 
        src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ38y4xKwEytQ9iCvWSFdjDD-xEjrzOphtiYVhJQdYiMI83re9SFeVEpQrUFGSngp1BXoTF6PEBj?gv=true" 
        style={{ border: 0, width: '100%', minHeight: '650px' }} 
        frameBorder="0"
        title="Schedule Appointment"
        allow="camera *; microphone *"
      />
    </div>
  );
}