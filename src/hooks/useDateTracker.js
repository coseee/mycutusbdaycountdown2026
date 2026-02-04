import { useState, useEffect, useCallback } from 'react';

export const useDateTracker = () => {
  // Get the time offset from URL parameter (for testing)
  const getTimeOffset = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get('date');
    if (dateParam) {
      const simulatedDate = new Date(dateParam);
      const realNow = new Date();
      // Return the difference to apply as an offset
      return simulatedDate.getTime() - realNow.getTime();
    }
    return 0;
  }, []);

  const [timeOffset] = useState(getTimeOffset);

  // Get current date with offset applied
  const getCurrentDate = useCallback(() => {
    return new Date(Date.now() + timeOffset);
  }, [timeOffset]);

  const [currentDate, setCurrentDate] = useState(getCurrentDate());

  useEffect(() => {
    // Update every second for smooth countdown
    const timer = setInterval(() => {
      setCurrentDate(getCurrentDate());
    }, 1000);
    return () => clearInterval(timer);
  }, [getCurrentDate]);

  // Event Constants
  const START_DATE = new Date('2026-02-07T00:00:00');
  const END_DATE = new Date('2026-02-15T00:00:00');

  const isPreEvent = currentDate < START_DATE;
  const isEventOver = currentDate >= END_DATE;
  const timeToStart = START_DATE - currentDate;

  return {
    currentDate,
    isPreEvent,
    isEventOver,
    timeToStart,
    START_DATE
  };
};
