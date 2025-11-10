import React from 'react';

interface SchedulerProps {
  scheduledDateTime: string;
  setScheduledDateTime: (dateTime: string) => void;
}

export const Scheduler: React.FC<SchedulerProps> = ({ scheduledDateTime, setScheduledDateTime }) => {
  
  const getToday = () => new Date().toISOString().split('T')[0];

  const dateValue = scheduledDateTime ? scheduledDateTime.split('T')[0] : '';
  const timeValue = scheduledDateTime ? scheduledDateTime.split('T')[1] : '';

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (!newDate) {
        setScheduledDateTime('');
        return;
    }
    const currentTime = timeValue || '12:00';
    setScheduledDateTime(`${newDate}T${currentTime}`);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    if (!newTime) {
        setScheduledDateTime('');
        return;
    }
    const currentDate = dateValue || getToday();
    setScheduledDateTime(`${currentDate}T${newTime}`);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
        4. Schedule Post (Optional)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="schedule-date" className="sr-only">Schedule Date</label>
          <input
            id="schedule-date"
            type="date"
            min={getToday()}
            value={dateValue}
            onChange={handleDateChange}
            className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="schedule-time" className="sr-only">Schedule Time</label>
          <input
            id="schedule-time"
            type="time"
            value={timeValue}
            onChange={handleTimeChange}
            className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      {scheduledDateTime && (
        <button 
          onClick={() => setScheduledDateTime('')}
          className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Clear Schedule
        </button>
      )}
    </div>
  );
};
