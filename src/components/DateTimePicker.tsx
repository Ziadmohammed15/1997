import React, { useState } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore } from 'date-fns';
import { ar } from 'date-fns/locale';

interface DateTimePickerProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: string) => void;
  availableTimes?: string[];
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  availableTimes = [
    '09:00 ص',
    '10:00 ص',
    '11:00 ص',
    '12:00 م',
    '01:00 م',
    '02:00 م',
    '03:00 م',
    '04:00 م',
    '05:00 م',
    '06:00 م',
  ],
  minDate = new Date(),
  maxDate = addMonths(new Date(), 3),
  className = ''
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
  const handleDateClick = (date: Date) => {
    onSelectDate(date);
    setIsCalendarOpen(false);
    
    // If no time is selected, open time picker
    if (!selectedTime) {
      setTimeout(() => setIsTimePickerOpen(true), 300);
    }
  };
  
  const handleTimeClick = (time: string) => {
    onSelectTime(time);
    setIsTimePickerOpen(false);
  };
  
  const isDateDisabled = (date: Date) => {
    return isBefore(date, minDate) || isBefore(maxDate, date);
  };
  
  const formatSelectedDate = () => {
    if (!selectedDate) return 'اختر التاريخ';
    return format(selectedDate, 'EEEE, d MMMM yyyy', { locale: ar });
  };

  return (
    <div className={`${className}`}>
      <div className="space-y-3">
        {/* Date Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setIsCalendarOpen(!isCalendarOpen);
              if (isTimePickerOpen) setIsTimePickerOpen(false);
            }}
            className="flex items-center w-full p-3 backdrop-blur-glass bg-white/60 dark:bg-secondary-800/60 rounded-xl border border-white/20 dark:border-secondary-700/30 shadow-glass"
          >
            <Calendar className="w-5 h-5 text-primary-500 ml-2" />
            <span className="flex-1 text-right text-secondary-700 dark:text-secondary-300">
              {formatSelectedDate()}
            </span>
          </button>
          
          <AnimatePresence>
            {isCalendarOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 top-full right-0 left-0 mt-2 bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-secondary-100 dark:border-secondary-700 p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={prevMonth}
                    className="p-1 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700"
                    disabled={isBefore(startOfMonth(currentMonth), startOfMonth(minDate))}
                  >
                    <ChevronRight className="w-5 h-5 text-secondary-500" />
                  </button>
                  <h3 className="font-medium dark:text-white">
                    {format(currentMonth, 'MMMM yyyy', { locale: ar })}
                  </h3>
                  <button
                    onClick={nextMonth}
                    className="p-1 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700"
                    disabled={isBefore(startOfMonth(maxDate), startOfMonth(currentMonth))}
                  >
                    <ChevronLeft className="w-5 h-5 text-secondary-500" />
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map((day) => (
                    <div key={day} className="text-center text-xs text-secondary-500 font-medium py-1">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, index) => (
                    <div key={`empty-${index}`} className="h-9"></div>
                  ))}
                  
                  {days.map((day) => {
                    const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                    const isDisabled = isDateDisabled(day);
                    const isTodayDate = isToday(day);
                    
                    return (
                      <button
                        key={day.toString()}
                        onClick={() => !isDisabled && handleDateClick(day)}
                        disabled={isDisabled}
                        className={`h-9 rounded-full flex items-center justify-center text-sm ${
                          isSelected
                            ? 'bg-primary-500 text-white'
                            : isTodayDate
                              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                              : isDisabled
                                ? 'text-secondary-300 dark:text-secondary-600 cursor-not-allowed'
                                : 'hover:bg-secondary-100 dark:hover:bg-secondary-700 text-secondary-700 dark:text-secondary-300'
                        }`}
                      >
                        {format(day, 'd')}
                      </button>
                    );
                  })}
                </div>
                
                <div className="mt-4 pt-4 border-t border-secondary-100 dark:border-secondary-700 flex justify-end">
                  <button
                    onClick={() => setIsCalendarOpen(false)}
                    className="px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg"
                  >
                    إلغاء
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Time Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setIsTimePickerOpen(!isTimePickerOpen);
              if (isCalendarOpen) setIsCalendarOpen(false);
            }}
            disabled={!selectedDate}
            className={`flex items-center w-full p-3 backdrop-blur-glass rounded-xl border shadow-glass ${
              !selectedDate
                ? 'bg-secondary-100/70 dark:bg-secondary-700/70 text-secondary-400 dark:text-secondary-500 cursor-not-allowed border-secondary-200/30 dark:border-secondary-600/30'
                : 'bg-white/60 dark:bg-secondary-800/60 border-white/20 dark:border-secondary-700/30'
            }`}
          >
            <Clock className={`w-5 h-5 ml-2 ${!selectedDate ? 'text-secondary-400' : 'text-primary-500'}`} />
            <span className="flex-1 text-right text-secondary-700 dark:text-secondary-300">
              {selectedTime || 'اختر الوقت'}
            </span>
          </button>
          
          <AnimatePresence>
            {isTimePickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 top-full right-0 left-0 mt-2 bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-secondary-100 dark:border-secondary-700 p-4"
              >
                <h3 className="font-medium mb-3 dark:text-white">اختر الوقت</h3>
                
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeClick(time)}
                      className={`p-2 text-center rounded-lg text-sm backdrop-blur-glass ${
                        selectedTime === time 
                          ? 'bg-primary-500/90 text-white shadow-neon dark:shadow-neon-dark border border-primary-400/50' 
                          : 'bg-white/70 dark:bg-secondary-700/70 text-secondary-700 dark:text-secondary-300 shadow-glass border border-white/20 dark:border-secondary-600/30'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-secondary-100 dark:border-secondary-700 flex justify-end">
                  <button
                    onClick={() => setIsTimePickerOpen(false)}
                    className="px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg"
                  >
                    إلغاء
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;